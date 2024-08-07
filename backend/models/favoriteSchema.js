const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// claude 3.5 sonnet 16:20 7/26/2024 normalize favorites schema
const favoriteSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    }
}, {timestamps: true});

// Compound index to ensure a user can only favorite a recipe once
favoriteSchema.index({userId: 1, recipeId: 1}, {unique: true});

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
