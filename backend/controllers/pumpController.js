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

// Controller function to fetch the latest pump history record for a given deviceId
const getLatestPumpHistory = async (req, res) => {
  try {
    const { deviceId } = req.body;

    // Find the latest pump history record for the given deviceId
    const latestPumpHistory = await PumpHistory.findOne({ deviceId })
      .sort({ timestamp: -1 })
      .lean();

    if (!latestPumpHistory) {
      return res
        .status(404)
        .json({ success: false, message: 'No pump history found for the given deviceId' });
    }

    res.status(200).json({ success: true, data: latestPumpHistory });
  } catch (error) {
    console.error('Error fetching the latest pump history record:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch the latest pump history record' });
  }
};

// Controller function to fetch pump history records for a given time range
const getPumpHistoryByTimeRange = async (req, res) => {
  try {
    const { deviceId, startDate, endDate } = req.query;

    // Construct the query based on parameters
    const query = { deviceId };
    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Fetch pump history records from the database
    const pumpHistoryRecords = await PumpHistory.find(query).sort({ timestamp: 1 });

    // Respond with the pump history records
    res.status(200).json({ success: true, data: pumpHistoryRecords });
  } catch (error) {
    console.error('Error fetching pump history records:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pump history records' });
  }
};

module.exports = {
  insertPumpHistory,
  getLatestPumpHistory,
  getPumpHistoryByTimeRange,
};