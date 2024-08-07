const express = require('express');
const router = express.Router();

const {
    handleSignup, handleLogin, handlePasswordReset, handleGetRecipesFromUser, handleFavoriteRecipe, handleUpdateUser,
    handleGetFavoritesFromUser, handleGetUser
} = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/passwordReset', handlePasswordReset);
router.get('/recipes/:id', handleGetRecipesFromUser);
router.get('/favorites/:id', authMiddleware, handleGetFavoritesFromUser);
router.post('/favorite', authMiddleware, handleFavoriteRecipe);
router.patch('/:id', handleUpdateUser);
router.get('/:id', handleGetUser);

module.exports = router;
