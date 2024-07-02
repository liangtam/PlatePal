const Recipe = require("../models/recipeModel");

const handleGetRecipe = (req, res) => {
    // TODO: implement
    res.status(200).json({message: `Successfully retreived recipe`});
}

const handleCreateRecipe = (req, res) => {
    // TODO: implement
    res.status(200).json({message: `Successfully saved recipe`});
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

const handleUpdateRecipe = (req, res) => {
    // TODO: implement
    res.status(200).json({message: `Successfully updated recipe`});
}

module.exports = {
    handleGetRecipe,
    handleCreateRecipe,
    handleDeleteRecipe,
    handleUpdateRecipe
}
