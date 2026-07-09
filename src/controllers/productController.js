const Product = require("../models/Product");

// GET /api/products
async function getAllProducts(req, res, next) {

    try {

        const products = await Product.find().sort({ id: 1 });

        res.json({ products });

    } catch (err) {

        next(err);

    }

}

module.exports = { getAllProducts };
