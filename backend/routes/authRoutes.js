const express = require('express');
const { login, register, verifyPassword, forgotPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verifyPassword', verifyPassword);
router.post('/forgot-password', forgotPassword);

module.exports = router;
