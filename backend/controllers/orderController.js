// controllers/orderController.js
const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalPrice, address } = req.body;
    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      address,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Controller method to get order history by user ID
exports.getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
