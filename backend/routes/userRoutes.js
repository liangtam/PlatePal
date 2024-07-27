const express = require('express');
const router = express.Router();

const { handleSignup, handleLogin, handlePasswordReset, handleGetRecipesFromUser, handleFavoriteRecipe, handleUpdateUser,
    handleGetFavoritesFromUser
} = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/passwordReset', handlePasswordReset);
router.get('/recipes/:id', handleGetRecipesFromUser);
router.get('/favorites/:id', authMiddleware, handleGetFavoritesFromUser);
router.post('/favorite', authMiddleware, handleFavoriteRecipe);
router.put('/users/:id', handleUpdateUser);

module.exports = router;
