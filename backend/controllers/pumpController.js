const PumpHistory = require('../models/pumpHistoryModel');

// Controller function to insert pump history record
const insertPumpHistory = async (req, res) => {
  try {
    // Extract data from the request body
    const { deviceId, pumpDuration } = req.body;

    // Create a new pump history record object
    const newPumpHistory = new PumpHistory({
      deviceId,
      pumpDuration
    });

    // Save the new pump history record to the database
    await newPumpHistory.save();

    // Respond with success message
    res.status(201).json({ success: true, message: 'Pump history record inserted successfully' });
  } catch (error) {
    // Handle any errors
    console.error('Error inserting pump history record:', error);
    res.status(500).json({ success: false, message: 'Failed to insert pump history record' });
  }
};

module.exports = {
  insertPumpHistory
};
