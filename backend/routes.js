const express = require('express');
const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/passwordReset', handlePasswordReset);

function handleSignup(req, res) {
    // TODO: signup
    res.status(200).send(`Called signup successfully, email and password: ${req.body.email} ${req.body.password}`);
}

function handleLogin(req, res) {
    // TODO: login
    res.status(200).send(`Called login successfully: email and password ${req.body.email} ${req.body.password}`);
}

function handlePasswordReset(req, res) {
    // TODO: password reset
    res.status(200).send(`Called reset password successfully: email ${req.body.email}`);
}

module.exports = router;
