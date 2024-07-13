const Recipe = require("../models/recipeModel");

const handleGetRecipe = (req, res) => {
    try {
        const { id } = req.params;
        const recipe = Recipe.findById(id)
        if (!recipe) {
            return res.status(404).json({message: "Recipe not found"});
        }
        return res.status(200).json(recipe);
    } catch (err) {
        res.status(400).json({message: "Could not fetch recipe."});
    }
}

const handleCreateRecipe = async (req, res) => {
    const {name, ingredients, instructions } = req.body;
    try {
        const recipe = await Recipe.create({name, ingredients, instructions});
        if (!recipe) {
            throw new Error("Could not create recipe");
        }
        return res.status(201).json(recipe);
    } catch (err) {
        return res.status(400).json({message: err.message})
    }
}

const handleDeleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Recipe.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        return res.status(200).json({ message: 'Successfully deleted recipe' });
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
