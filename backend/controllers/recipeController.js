const handleGetRecipe = (req, res) => {
    // TODO: implement
    res.status(200).json({message: `Successfully retreived recipe`});
}

const handleCreateRecipe = (req, res) => {
    // TODO: implement
    res.status(200).json({message: `Successfully saved recipe`});
}

const handleDeleteRecipe = (req, res) => {
    // TODO: implement
    res.status(200).json({message: `Successfully deleted recipe`});
}

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