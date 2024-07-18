const mongoose = require('mongoose');
const User = require('./userModel');

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
    image: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favoritedBy: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: false
    }
}, {timestamps: true});

// Middleware for ensuring consistency on recipe save
recipeSchema.pre('save', async function (next)  {
    const recipe = this;

    if (recipe.isModified('starredBy')) {
        const favoritedBy = recipe.favoritedBy;

        await Promise.all(favoritedBy.map(async (userId) => {
            const user = await User.findById(userId);

            if (user && !user.favoritedRecipes.includes(recipe._id)) {
                user.favoritedRecipes.push(recipe._id);
                await user.save();
            }
        }));
    }

    next();
});

// Middleware for ensuring consistency on recipe remove
recipeSchema.pre('remove', async function (next) {
    const recipe = this;

    await Promise.all(recipe.favoritedBy.map(async (userId) => {
        const user = await User.findById(userId);

        if (user) {
            user.favoritedRecipes.pull(recipe._id);
            await user.save();
        }
    }));

    next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
