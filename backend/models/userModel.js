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

// Middleware for adding a starred recipe
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('starredRecipes')) {
        const favoritedRecipes = user.favoritedRecipes;

        await Promise.all(favoritedRecipes.map(async (recipeId) => {
            const recipe = await Recipe.findById(recipeId);

            if (recipe && !recipe.favoritedBy.includes(user._id)) {
                recipe.favoritedBy.push(user._id);
                await recipe.save();
            }
        }));
    }

    next();
});

// Middleware for removing a starred recipe
userSchema.pre('remove', async function (next) {
    const user = this;

    await Promise.all(user.favoritedRecipes.map(async (recipeId) => {
        const recipe = await Recipe.findById(recipeId);

        if (recipe) {
            recipe.favoritedBy.pull(user._id);
            await recipe.save();
        }
    }));

    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
