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
    estimatedTime: {
        type: Number,
        required: true
    },
    foodProperties: {
        type: Object,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shareToPublic: {
        type: Boolean,
        required: true,
        default: false
    }

}, {timestamps: true});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
