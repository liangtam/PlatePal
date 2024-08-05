const mongoose = require('mongoose');

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
    allergies: {
        type: Array,
        required: true
    },
    dislikedRecipes: {
        type: Array,
        required: true
    },
    preferences: {
        type: Object,
        required: false
    },
    recipes: {
        type: [Schema.Types.ObjectId],
        ref: 'Recipe',
        required: true
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
