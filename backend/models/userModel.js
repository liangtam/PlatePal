const mongoose = require('mongoose');
const Recipe = require('./recipeModel');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    recipes: {
        type: [Schema.Types.ObjectId],
        ref: 'Recipe',
        required: true
    },
    favoriteRecipes: {
        type: [Schema.Types.ObjectId],
        ref: 'Recipe',
        required: false
    },
    tempPassword: {
        password: {
            type: String,
            required: false
        },
        expiry: {
            type: Date,
            required: false
        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
