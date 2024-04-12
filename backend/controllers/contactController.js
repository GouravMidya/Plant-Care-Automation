const Contact = require('../models/ContactModel');

exports.addContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).send('Contact added successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};