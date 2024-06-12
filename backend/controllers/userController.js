const User = require("../models/userModel");
const {sign} = require("jsonwebtoken");
const {hash} = require("bcrypt");

const handleSignup = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    try {
        const user = await User.findOne({email: email});
        if (user) {
            return res.status(404).json({message: 'Error: email already in use.'});
        }
        const hashedPassword = await hash(password, 10);
        const newUser = new User({ email: email, password: hashedPassword, recipes: [] });
        const token = sign(
            { email: email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        await newUser.save();
        return res.status(201).json({ message: 'Signup successful.', token });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // TODO: Implement login logic here

        return res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const handlePasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        // TODO: Implement password reset logic here

        return res.status(200).json({ message: 'Password reset link sent.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const handleGetRecipesFromUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        // TODO: Implement logic to get recipes here

        return res.status(200).json({ message: `Retrieved recipes for user: ${email}` });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    handleSignup,
    handleLogin,
    handlePasswordReset,
    handleGetRecipesFromUser
};
