const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const { handleGenerateRecipes, handleGetRecipe, handleDeleteRecipe, handleUpdateRecipe, handleCreateRecipe,
    handleGetAllRecipes, handleGetRecipesToPublic
} = require('../controllers/recipeController');
const router = express.Router();

const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.get('/all', handleGetAllRecipes);
router.get('/public', handleGetRecipesToPublic);
router.get("/generate", handleGenerateRecipes)
router.get('/:id', handleGetRecipe);
router.delete('/:id', handleDeleteRecipe);
router.patch('/:id', handleUpdateRecipe);
router.post('/', authMiddleware, upload.single('image'), handleCreateRecipe);

module.exports = router;
