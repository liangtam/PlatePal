/*
gpt-4o 19:26 6/11
 It'll send to the input email an email with a temporary password. No matter whether that email is registered, it'll return success.
 */
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service provider
    auth: {
        user: process.env.EMAIL, // your email address
        pass: process.env.EMAIL_PASSWORD // your email password or app password
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
