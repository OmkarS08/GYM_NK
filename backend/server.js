const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const activityLog  = require('./routes/activityRoutes');
const dashboard = require('./routes/dashboardRoutes');
const staffMember = require('./routes/staffMemberRoutes');
const steamBath = require('./routes/steamBathRoutes');
const package = require('./routes/packageRoutes');
const Transaction = require('./routes/transactionRoutes')
const uploadRoutes = require('./routes/uploadRoutes');
const app = express();
app.use(cors());
app.use(express.json());



app.use('/auth', authRoutes);
app.use('/members', memberRoutes);
app.use('/activityLog',activityLog);
app.use('/dashboard',dashboard)
app.use('/staffMember',staffMember);
app.use('/steamBath',steamBath);
app.use('/transaction',Transaction);
app.use('/package',package);
app.use('/upload', uploadRoutes);

const PORT = 8081
app.listen(process.env.PORT || PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});


