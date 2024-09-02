const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require('../models/authSchema.js');
const nodemailer = require('nodemailer');
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await Auth.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, email, password: hashedPassword };
        await Auth.create(newUser);
        res.status(201).json({ status: true, message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).json({ status: true, message: "Login successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Forgot Password Route
router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '1h' });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password Link',
            text: `http://localhost:5173/resetPassword/${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to send email' });
            }
            res.status(200).json({ message: 'Check your email for the reset password link' });
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Reset Password Route
router.post('/resetPassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const hashedPassword = await bcrypt.hash(password, 10);
        await Auth.findByIdAndUpdate(decoded.id, { password: hashedPassword });
        res.status(200).json({ status: true, message: "Password updated successfully" });
    } catch (err) {
        res.status(400).json({ status: false, message: "Invalid token or request" });
    }
});

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided" });
        }
        await jwt.verify(token, process.env.KEY);
        next(); // Token is valid; proceed to the route handler
    } catch (err) {
        return res.status(401).json({ status: false, message: "Invalid token" });
    }
};

router.post('/verify', verifyUser, (req, res) => {
    res.status(200).json({ status: true, message: "User verified" });
});



// Logout Route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ status:true,message: "Logged out successfully" });
});

module.exports = router;
