const Order = require("../models/Order");

// POST /api/orders  (protected)
async function createOrder(req, res, next) {

    try {

        const { items, total, customer } = req.body;

        if (!items || items.length === 0) {

            return res.status(400).json({ message: "Cart is empty." });

        }

        if (!customer || !customer.fullName || !customer.phone || !customer.address) {

            return res.status(400).json({ message: "Please fill in all delivery details." });

        }

        const order = await Order.create({
            user: req.user._id,
            items,
            total,
            customer
        });

        res.status(201).json({ order });

    } catch (err) {

        next(err);

    }

}

// GET /api/orders/my  (protected)
// Only ever returns orders belonging to req.user — this is the
// piece that guarantees different accounts never see each other's orders.
async function getMyOrders(req, res, next) {

    try {

        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.json({ orders });

    } catch (err) {

        next(err);

    }

}

module.exports = { createOrder, getMyOrders };
