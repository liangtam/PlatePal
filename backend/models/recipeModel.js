const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    instructions: {
        type: Array,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {timestamps: true});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
