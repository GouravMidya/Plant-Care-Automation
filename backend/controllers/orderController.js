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
      status: [{ status: 'Pending', updatedAt: Date.now() }], // Set initial status as 'pending'
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
    const { orderId, newStatus } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status.push({
      status: newStatus,
      remarks: '',
      updatedAt: Date.now(),
    });

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

    const pending = [];
    const shipped = [];
    const delivered = [];

    orders.forEach((order) => {
      if (order.status && order.status.length > 0) {
        const latestStatus = order.status[order.status.length - 1];

        if (latestStatus.status === 'Pending') {
          pending.push(order);
        } else if (latestStatus.status === 'Shipped') {
          shipped.push(order);
        } else if (latestStatus.status === 'Delivered') {
          delivered.push(order);
        }
      }
    });

    res.json({ pending, shipped, delivered });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
