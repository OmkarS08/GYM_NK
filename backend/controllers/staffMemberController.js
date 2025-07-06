const db = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');

// Get all staff/admin users from adminUser collection
const staffMember = async (req, res) => {
  try {
    const snapshot = await db.collection('adminUser').get();
    const staff = snapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().email,
      admin: doc.data().admin ? 1 : 0, // 1 for admin, 0 for staff
    }));
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch staff members', error: err.message });
  }
};

// Add a new staff member
const addStaffMember = async (req, res) => {
    const { name, password, role } = req.body;
    if (!name || !password || typeof role === 'undefined') {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        // Check if user already exists
        const snapshot = await db.collection('adminUser').where('email', '==', name).get();
        if (!snapshot.empty) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('adminUser').add({
            email: name,
            password: hashedPassword,
            admin: role,
            delete_flag_login: 0,
            createdAt: new Date()
        });
        res.status(200).json({ message: 'Staff member added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error adding staff member', details: err.message });
    }
};

// Update staff member's role (admin field)
const updateStaff = async (req, res) => {
    const id = req.params.id;
    const { admin } = req.body;
    try {
        await db.collection('adminUser').doc(id).update({ admin });
        return res.json({ message: "Staff role updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Error in backend", error: err.message });
    }
};

// Permanently delete staff member
const deleteStaffMember = async (req, res) => {
    const id = req.params.id;
    try {
        await db.collection('adminUser').doc(id).delete();
        return res.json({ message: "Staff member permanently deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error in backend", error: err.message });
    }
};

module.exports = { staffMember, addStaffMember, deleteStaffMember, updateStaff };