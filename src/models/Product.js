const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    // Keeping a simple numeric id so the existing frontend
    // (cart/wishlist logic) keeps working without a rewrite.
    id: {
        type: Number,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        default: 4.5
    },

    badge: {
        type: String,
        default: ""
    },

    image: {
        type: String,
        required: true
    },

    stock: {
        type: Number,
        default: 50
    }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
