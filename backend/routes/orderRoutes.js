// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to create a new order
router.post('/', orderController.createOrder);

// Route to get order history by user ID
router.get('/:userId', orderController.getOrderHistory);

module.exports = router;
