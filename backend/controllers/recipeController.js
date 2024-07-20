const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");

const handleGetRecipe = async (req, res) => {
  try {
    const {id} = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({message: "Recipe not found"});
    }
    return res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: "Could not fetch recipe."});
  }
};

const handleCreateRecipe = async (req, res) => {
    const { name, ingredients, instructions, userId } = req.body;

    let imageBase64 = null;
    if (req.file) {
        const base64String = req.file.buffer.toString('base64');
        imageBase64 = `data:${req.file.mimetype};base64,${base64String}`;
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const recipe = await Recipe.create({ name, ingredients, instructions, image: imageBase64, userId });
        if (!recipe) {
            return res.status(400).json({message: "Could not create recipe"});
        }
        user.recipes.push(recipe);
        await user.save();
        return res.status(201).json(recipe);
    } catch (err) {
        return res.status(500).json({ message: "Internal error" });
    }
};

const handleDeleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Recipe.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const user = await User.findById(result.userId);

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        user.recipes = user.recipes.filter(recipeId => recipeId.toString() !== id);
        await user.save();

        return res.status(200).json({ message: 'Successfully deleted recipe!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const handleUpdateRecipe = async (req, res) => {
    try {
        const {id} = req.params;

        const updatedRecipe = await Recipe.findOneAndUpdate(id, req.body, {new: true, runValidators: true});

        if (!updatedRecipe) {
            return res.status(404).json({message: "Recipe not found"});
        }
        res.status(200).json(updatedRecipe);
    } catch (err) {
        return res.status(400).json({message: err.message});
    }
}

module.exports = {
    handleGetRecipe,
    handleCreateRecipe,
    handleDeleteRecipe,
    handleUpdateRecipe
}
