// controllers/ticketController.js
const Ticket = require('../models/ticketModel');
const User = require('../models/User');

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
      'status.status': { $ne: 'Closed' },
    });
    const ticketHistory = await Ticket.find({
      userId,
      'status.status': 'Closed',
    });
    res.status(200).json({ currentTickets, ticketHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, remarks } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const updatedStatus = [
      ...ticket.status,
      {
        status,
        remarks,
        updatedAt: new Date(),
      },
    ];

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status: updatedStatus },
      { new: true }
    );

    res.status(200).json({ message: 'Ticket updated successfully', data: updatedTicket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.aggregate([
      {
        $lookup: {
          from: 'users', // Name of the User model collection
          localField: 'userId', // Field in the Ticket model to match
          foreignField: '_id', // Field in the User model to match
          as: 'user', // Alias for the joined data
        },
      },
      {
        $group: {
          _id: '$userId',
          user: { $first: '$user' }, // Include the first matched user document
          tickets: { $push: '$$ROOT' },
        },
      },
    ]);

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};