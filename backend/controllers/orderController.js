// controllers/orderController.js
const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { userId, items, totalPrice, address } = req.body;
    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      address,
      status: [{ status: 'Order Placed', updatedAt: Date.now() }], // Set initial status as 'pending'
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, remarks } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status.push({ status, remarks, updatedAt: Date.now() });
    await order.save();
    res.json(order);
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

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    const pending = orders.filter((order) => order.status === 'pending');
    const shipped = orders.filter((order) => order.status === 'shipped');
    const delivered = orders.filter((order) => order.status === 'delivered');

    res.json({ pending, shipped, delivered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
