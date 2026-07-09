const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(user) {

    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

}

function publicUser(user) {

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
    };

}

// POST /api/auth/signup
async function signup(req, res, next) {

    try {

        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {

            return res.status(400).json({ message: "Please fill in all the details." });

        }

        const existing = await User.findOne({ email: email.toLowerCase() });

        if (existing) {

            return res.status(400).json({ message: "An account with this email already exists." });

        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone,
            password
        });

        const token = generateToken(user);

        res.status(201).json({ token, user: publicUser(user) });

    } catch (err) {

        next(err);

    }

}

// POST /api/auth/login
async function login(req, res, next) {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({ message: "Please enter email and password." });

        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {

            return res.status(401).json({ message: "No account found with this email." });

        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {

            return res.status(401).json({ message: "Incorrect password." });

        }

        const token = generateToken(user);

        res.json({ token, user: publicUser(user) });

    } catch (err) {

        next(err);

    }

}

// GET /api/auth/me  (protected)
async function getMe(req, res) {

    res.json({ user: publicUser(req.user) });

}

module.exports = { signup, login, getMe };
