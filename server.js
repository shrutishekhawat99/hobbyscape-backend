require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

const authRoutes = require("./src/routes/authRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const productRoutes = require("./src/routes/productRoutes");

const app = express();

// ----------------------------
// Middleware
// ----------------------------

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "*"
}));

app.use(express.json());

// ----------------------------
// Routes
// ----------------------------

app.get("/", (req, res) => {

    res.json({ message: "DIY.HobbyScape API is running 🎨" });

});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

// 404 handler
app.use((req, res) => {

    res.status(404).json({ message: "Route not found." });

});

// Central error handler (always last)
app.use(errorHandler);

// ----------------------------
// Start
// ----------------------------

const PORT = process.env.PORT || 5000;

connectDB().then(() => {

    app.listen(PORT, () => {

        console.log(`🚀 Server running on port ${PORT}`);

    });

});
