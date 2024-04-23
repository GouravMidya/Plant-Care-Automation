const PumpHistory = require('../models/pumpHistoryModel');

// Controller function to insert pump history record
const insertPumpHistory = async (req, res) => {
  try {
    // Extract data from the request body
    const { deviceId, pumpDuration,threshold } = req.body;

    // Convert pump duration from milliseconds to seconds
    const pumpDurationInSeconds = pumpDuration;
    // Create a new pump history record object
    const newPumpHistory = new PumpHistory({
      deviceId,
      pumpDuration: pumpDurationInSeconds,
      threshold
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
    const latestPumpHistory = await PumpHistory.findOne({ deviceId })
      .sort({ timestamp: -1 })
      .lean();

    if (!latestPumpHistory) {
      // Return a default or placeholder value instead of a 404 error
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({ success: true, data: latestPumpHistory });
  } catch (error) {
    console.error('Error fetching the latest pump history record:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch the latest pump history record' });
  }
};

const getPumpHistoryByTimeRange = async (req, res) => {
  try {
    const { deviceId, startDate, endDate } = req.query;

    // Construct the query based on parameters
    const query = { deviceId };
    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Fetch pump history records from the database
    let pumpHistoryRecords = await PumpHistory.find(query).sort({ timestamp: 1 });
    
    // Convert timestamps to IST
    pumpHistoryRecords = pumpHistoryRecords.map(record => {
      return {
        ...record.toObject(), // Convert Mongoose document to plain object
        timestamp: record.timestamp.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) // Convert to IST
      };
    });

    // Initialize frequency data for each hour
    const frequencyData = Array(24).fill(0);

    // Calculate frequency for each hour
    pumpHistoryRecords.forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      frequencyData[hour]++; // Increment frequency for the respective hour
    });
    
    // Format the result
    const result = frequencyData.map((frequency, index) => ({
      time: index+":00",
      frequency
    }));

    // Respond with the pump history records
    res.status(200).json({ success: true, data: result });
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