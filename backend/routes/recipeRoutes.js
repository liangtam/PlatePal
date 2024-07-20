const express = require('express');
const { handleGetRecipe, handleDeleteRecipe, handleUpdateRecipe, handleCreateRecipe } = require('../controllers/recipeController');
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id', handleGetRecipe);
router.delete('/:id', handleDeleteRecipe);
router.patch('/:id', handleUpdateRecipe);
router.post('/', authMiddleware, upload.single('image'), handleCreateRecipe);

module.exports = router;
