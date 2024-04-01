// controllers/ticketController.js
const Ticket = require('../models/ticketModel');

exports.createTicket = async (req, res) => {
  try {
    const { title, description, location, contactDetails, deviceId, userId } = req.body;
    const newTicket = await Ticket.create({
      title,
      description,
      location,
      contactDetails,
      deviceId,
      userId,
    });
    res.status(201).json({ message: 'Ticket created successfully', data: newTicket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const { userId } = req.query;
    const currentTickets = await Ticket.find({ userId, status: 'Open' });
    const ticketHistory = await Ticket.find({ userId, status: { $ne: 'Open' } });
    res.status(200).json({ currentTickets, ticketHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};