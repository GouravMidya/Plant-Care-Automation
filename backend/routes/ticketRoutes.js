// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicket, getAllTickets } = require('../controllers/ticketController');

router.post('/', createTicket);
router.get('/', getTickets);
router.patch('/:ticketId', updateTicket);
router.get('/admin', getAllTickets); // Add this new route

module.exports = router;