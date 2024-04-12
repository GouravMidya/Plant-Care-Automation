// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const { createTicket, getTickets,updateTicket } = require('../controllers/ticketController');

router.post('/', createTicket);
router.get('/', getTickets);
router.put('/', updateTicket); 

module.exports = router;