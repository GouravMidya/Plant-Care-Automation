// controllers/productController.js

const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, imageUrl, price, description } = req.body;

    const newProduct = new Product({
      name,
      imageUrl,
      price,
      description,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
