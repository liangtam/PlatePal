const express = require('express');
const router = express.Router();

const { handleSignup, handleLogin, handlePasswordReset } = require('../controllers/userController');

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/passwordReset', handlePasswordReset);

module.exports = router;
