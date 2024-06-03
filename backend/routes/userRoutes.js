const express = require('express');
const router = express.Router();

const { handleSignup, handleLogin, handlePasswordReset, handleGetRecipesFromUser } = require('../controllers/userController');

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/passwordReset', handlePasswordReset);
router.get('/recipes/:id', handleGetRecipesFromUser);

module.exports = router;
