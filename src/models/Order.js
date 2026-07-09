const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({

    productId: Number,
    name: String,
    price: Number,
    image: String,
    quantity: Number

}, { _id: false });

const orderSchema = new mongoose.Schema({

    // Tied to the logged-in user via their MongoDB _id.
    // This is what guarantees no data mixup between accounts —
    // every query for "my orders" filters strictly by this field.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: {
        type: [orderItemSchema],
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    customer: {
        fullName: String,
        email: String,
        phone: String,
        address: String
    },

    status: {
        type: String,
        enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
        default: "Placed"
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
