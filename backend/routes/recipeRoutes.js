const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const { handleGenerateRecipes, handleGetRecipe, handleDeleteRecipe, handleUpdateRecipe, handleCreateRecipe } = require('../controllers/recipeController');
const router = express.Router();

router.get("/generate", handleGenerateRecipes)
router.get('/:id', handleGetRecipe);
router.delete('/:id', handleDeleteRecipe);
router.patch('/:id', handleUpdateRecipe);
router.post('/', authMiddleware, handleCreateRecipe);

module.exports = router;
