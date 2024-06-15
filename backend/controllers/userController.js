const User = require("../models/userModel");
const {sign} = require("jsonwebtoken");
const {hash, compare} = require("bcrypt");
const sendEmail = require("./emailService");
const validator = require('validator');
const crypto = require('crypto');

const handleSignup = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required.'});
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({error: 'Invalid email format.'});
    }

    try {
        const user = await User.findOne({email: email});
        if (user) {
            return res.status(400).json({error: 'Error: email already in use.'});
        }
        const hashedPassword = await hash(password, 10);
        const newUser = new User({email: email, password: hashedPassword, recipes: []});
        const token = sign(
            {email: email},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        await newUser.save();
        return res.status(201).json({message: 'Signup successful.', token});
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
};

const handleLogin = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email.' });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('User does not exist'); // Detailed error message on backend only for security.
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        let match = await compare(password, user.password);

        // Check for temporary password only if primary password fails
        if (!match && user.tempPassword && user.tempPassword.password) {
            if (user.tempPassword.expiry > new Date()) {
                // Temporary password is valid, compare it
                match = await compare(password, user.tempPassword.password);
            }
            if (match) {
                // Temporary password matched
                user.tempPassword.password = null;
                user.tempPassword.expiry = null;
                await user.save();
            }
        }

        if (!match) {
            console.log('Invalid password');
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const token = sign(
            { email: email },
            process.env.JWT_SECRET,
            rememberMe ? {} : { expiresIn: '1h' }
        );
        return res.status(200).json({ message: 'Login successful.', token: token });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const handlePasswordReset = async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({error: 'Email is required.'});
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({error: 'Invalid email.'});
    }

    try {
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(200).json({message: 'Done.'});
        }

        // Generate a cryptographically secure random temporary password
        const tempPassword = crypto.randomBytes(16).toString('hex');
        const hashedTempPassword = await hash(tempPassword, 10);
        const tempPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        user.tempPassword = {
            password: hashedTempPassword,
            expiry: tempPasswordExpiry
        }

        await Promise.all([
            user.save(),
            sendEmail(email, 'Password Reset',
                `Your temporary password is ${tempPassword}. It will expire in 1 hour. Please do not share it with anyone.`)
        ]);

        return res.status(200).json({message: 'Done.'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
};

const handleGetRecipesFromUser = async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({error: 'Email is required.'});
    }

    try {
        // TODO: Implement logic to get recipes here

        return res.status(200).json({message: `Retrieved recipes for user: ${email}`});
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
};

module.exports = {
    handleSignup,
    handleLogin,
    handlePasswordReset,
    handleGetRecipesFromUser
};
