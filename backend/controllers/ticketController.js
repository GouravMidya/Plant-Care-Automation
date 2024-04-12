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
      status: [{ status: 'Open' }],
    });
    res.status(201).json({ message: 'Ticket created successfully', data: newTicket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const { userId } = req.query;
    const currentTickets = await Ticket.find({
      userId,
      'status.status': 'Open',
    });
    const ticketHistory = await Ticket.find({
      userId,
      'status.status': { $ne: 'Open' },
    });
    res.status(200).json({ currentTickets, ticketHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { ticketId, status, remarks } = req.body;

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId },
      {
        $push: {
          status: { status, remarks, updatedAt: new Date() },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket updated successfully', data: updatedTicket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};