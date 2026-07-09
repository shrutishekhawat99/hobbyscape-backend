// Run with: npm run seed
// Populates the Product collection with DIY.HobbyScape's current catalog.
// Safe to re-run — it clears existing products first.

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
    { id: 1, name: "Bear Figurine Kit", price: 499, category: "figurine", rating: 4.9, badge: "Best Seller", image: "images/products/p1.jpg" },
    { id: 2, name: "Cat Magnet Set", price: 299, category: "magnet", rating: 4.8, badge: "New", image: "images/products/p2.jpg" },
    { id: 3, name: "Mermaid Figurine", price: 699, category: "figurine", rating: 5.0, badge: "Trending", image: "images/products/p3.jpg" },
    { id: 4, name: "Pastel Paint Kit", price: 399, category: "paint", rating: 4.7, badge: "Popular", image: "images/products/p4.jpg" },
    { id: 5, name: "Bunny Figurine", price: 599, category: "figurine", rating: 4.9, badge: "New", image: "images/products/p5.jpg" },
    { id: 6, name: "Butterfly Magnet", price: 249, category: "magnet", rating: 4.8, badge: "Hot", image: "images/products/p6.jpg" },
    { id: 7, name: "Mini Mushroom House", price: 899, category: "figurine", rating: 5.0, badge: "Best Seller", image: "images/products/p7.jpg" },
    { id: 8, name: "Sunflower Paint Set", price: 349, category: "paint", rating: 4.6, badge: "Trending", image: "images/products/p8.jpg" },
    { id: 9, name: "Panda DIY Kit", price: 799, category: "figurine", rating: 4.9, badge: "Cute", image: "images/products/p9.jpg" },
    { id: 10, name: "Flower Magnet Pack", price: 279, category: "magnet", rating: 4.7, badge: "Popular", image: "images/products/p10.jpg" },
    { id: 11, name: "Brush Starter Kit", price: 199, category: "accessories", rating: 4.5, badge: "Essential", image: "images/products/p11.jpg" },
    { id: 12, name: "Color Palette Set", price: 149, category: "accessories", rating: 4.8, badge: "Must Have", image: "images/products/p12.jpg" }
];

async function seed() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected. Clearing old products...");

        await Product.deleteMany({});

        await Product.insertMany(products);

        console.log(`✅ Seeded ${products.length} products successfully.`);

        process.exit(0);

    } catch (err) {

        console.error("❌ Seeding failed:", err.message);
        process.exit(1);

    }

}

seed();
