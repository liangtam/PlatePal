const express = require('express');
const router = express.Router();

const { handleSignup, handleLogin, handlePasswordReset, handleGetRecipesFromUser, handleFavoriteRecipe, handleUpdateUser } = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/passwordReset', handlePasswordReset);
router.get('/recipes/:id', handleGetRecipesFromUser);
router.post('/favorite', authMiddleware, handleFavoriteRecipe);
router.put('/users/:id', handleUpdateUser);

module.exports = router;
