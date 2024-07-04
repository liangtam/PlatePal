const express = require('express');
const router = express.Router();

const { handleSignup, handleLogin, handlePasswordReset, handleGetRecipesFromUser, handleFavoriteRecipe} = require('../controllers/userController');
const authMiddleware = require("../controllers/middleware");

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/passwordReset', handlePasswordReset);
router.get('/recipes/:id', handleGetRecipesFromUser);
router.post('/favorite', authMiddleware, handleFavoriteRecipe);

module.exports = router;
