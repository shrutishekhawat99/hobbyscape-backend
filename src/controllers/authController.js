const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

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

// POST /api/auth/forgot-password
async function forgotPassword(req, res, next) {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({ message: "Please enter your email address." });

        }

        const user = await User.findOne({ email: email.toLowerCase() });

        // Always respond the same way whether or not the account exists —
        // this stops someone from using this form to check which emails
        // are registered.
        const genericMessage = "If an account exists with that email, a reset link has been sent.";

        if (!user) {

            return res.json({ message: genericMessage });

        }

        // Generate a random token. We email the PLAIN version to the user,
        // but only ever store its hash — same principle as a password.
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password.html?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

        try {

            await sendEmail({
                to: user.email,
                subject: "Reset your DIY.HobbyScape password",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width:480px; margin:0 auto;">
                        <h2 style="color:#F6AFC1;">DIY.HobbyScape 💜</h2>
                        <p>Hi ${user.name},</p>
                        <p>We received a request to reset your password. This link will expire in 15 minutes.</p>
                        <p>
                            <a href="${resetLink}" style="display:inline-block; padding:12px 28px; background:#F6AFC1; color:#fff; border-radius:50px; text-decoration:none; font-weight:600;">
                                Reset Password
                            </a>
                        </p>
                        <p>If you didn't request this, you can safely ignore this email.</p>
                    </div>
                `
            });

        } catch (emailErr) {

            console.error("Email sending failed:", emailErr.message);

            // Don't reveal the email failure to the client — respond
            // the same generic way, but log it for debugging.

        }

        res.json({ message: genericMessage });

    } catch (err) {

        next(err);

    }

}

// POST /api/auth/reset-password
async function resetPassword(req, res, next) {

    try {

        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword) {

            return res.status(400).json({ message: "Missing required information." });

        }

        if (newPassword.length < 8) {

            return res.status(400).json({ message: "Password must be at least 8 characters." });

        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            email: email.toLowerCase(),
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {

            return res.status(400).json({ message: "This reset link is invalid or has expired. Please request a new one." });

        }

        user.password = newPassword; // hashed automatically by the pre-save hook
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({ message: "Your password has been reset successfully. You can now log in." });

    } catch (err) {

        next(err);

    }

}

module.exports = { signup, login, getMe, forgotPassword, resetPassword };
