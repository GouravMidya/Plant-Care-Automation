const SensorRecord = require('../models/SensorRecordModel');

// Controller function to insert sensor record
const insertSensorRecord = async (req, res) => {
  try {
    // Extract data from the request body
    const { deviceId, soilMoisture, humidity, temperature } = req.body;

    // Create a new sensor record object
    const newSensorRecord = new SensorRecord({
      deviceId,
      soilMoisture,
      humidity,
      temperature
    });

    // Save the new sensor record to the database
    await newSensorRecord.save();

    // Respond with success message
    res.status(201).json({ success: true, message: 'Sensor record inserted successfully' });
  } catch (error) {
    // Handle any errors
    console.error('Error inserting sensor record:', error);
    res.status(500).json({ success: false, message: 'Failed to insert sensor record' });
  }
};

// Controller function to fetch sensor records
const getSensorRecords = async (req, res) => {
  try {
    // Extract parameters from the request, e.g., deviceId, time range, etc.
    const { deviceId, startDate, endDate } = req.query;

    // Construct the query based on parameters
    const query = { deviceId };

    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Fetch sensor records from the database
    const sensorRecords = await SensorRecord.find(query).sort({ timestamp: 1 });

    // Respond with the fetched sensor records
    res.status(200).json({ success: true, data: sensorRecords });
  } catch (error) {
    // Handle any errors
    console.error('Error fetching sensor records:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sensor records' });
  }
};


module.exports = {
  insertSensorRecord,
  getSensorRecords
};
