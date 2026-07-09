const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protects routes — checks for a valid "Bearer <token>"
// in the Authorization header and attaches the user to req.user
async function protect(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(401).json({ message: "Not authorized. Please log in." });

    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {

            return res.status(401).json({ message: "User no longer exists." });

        }

        req.user = user;

        next();

    } catch (err) {

        return res.status(401).json({ message: "Invalid or expired session. Please log in again." });

    }

}

module.exports = protect;
