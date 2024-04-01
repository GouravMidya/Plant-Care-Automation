// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const { createTicket, getTickets } = require('../controllers/ticketController');

router.post('/', createTicket);
router.get('/', getTickets);

module.exports = router;