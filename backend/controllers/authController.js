const db = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Register new admin user
exports.register = async (req, res) => {
  const { email, password, admin = false } = req.body;
  try {
    const snapshot = await db.collection('adminUser').where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('adminUser').add({
      email,
      password: hashedPassword,
      admin,
      createdAt: new Date()
    });
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login admin user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const snapshot = await db.collection('adminUser').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const userDoc = snapshot.docs[0];
    const user = userDoc.data();
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user: { id: userDoc.id, email: user.email, admin: user.admin } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Verify admin user password
exports.verifyPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const snapshot = await db.collection('adminUser').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = snapshot.docs[0].data();
    const isMatch = await require('bcryptjs').compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Password verified' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};

// Forgot password (send reset link)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const snapshot = await db.collection('adminUser').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No user found with this email' });
    }
    // Generate a simple reset token (for demo, use JWT or random string in production)
    const resetToken = Math.random().toString(36).substring(2, 15);
    // Save token to Firestore (optional, for real reset flow)
    // await db.collection('adminUser').doc(snapshot.docs[0].id).update({ resetToken });

    // Send email (configure your SMTP details)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'omkar1144@gmail.com', // replace with your email
        pass: 'sanjiv@#kanchan' // use app password, not your real password
      }
    });

    const mailOptions = {
      from: 'omkar1144@gmail.com',
      to: email,
      subject: 'Gym Management Password Reset',
      text: `Your password reset code is: ${resetToken}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reset email', error: err.message });
  }
};
