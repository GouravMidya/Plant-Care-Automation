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

// Controller function to fetch all sensor records from start date to end date for a particular device
const getSensorRecord = async (req, res) => {
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

// Method to get daily averages for a particular device based on start date and end date
const getDailyAverages = async (req, res) => {
  try {
    const { deviceId, startDate, endDate } = req.query;

    // Construct the query based on parameters
    const query = { deviceId };

    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Fetch sensor records from the database
    const sensorRecords = await SensorRecord.find(query).sort({ timestamp: 1 });

    // Calculate daily averages for soil moisture and temperature
    const dailyAverages = Array.from({ length: 24 }, () => ({ count: 0, sumSoilMoisture: 0, sumTemperature: 0 }));

    sensorRecords.forEach((record) => {
      const hour = new Date(record.timestamp).getHours();
      dailyAverages[hour].count += 1;
      dailyAverages[hour].sumSoilMoisture += record.soilMoisture;
      dailyAverages[hour].sumTemperature += record.temperature;
    });

    // Static array for hours in a day
    const hoursInDay = Array.from({ length: 24 }, (_, index) => index);

    const formattedDailyAverages = hoursInDay.map((hour, index) => {
      const hourString = hour.toString().padStart(2, '0');
      const timestamp = new Date(`2000-01-01T${hourString}:00:00`).toISOString();
      const avgSoilMoisture = dailyAverages[index].count === 0 ? 0 : Number(dailyAverages[index].sumSoilMoisture / dailyAverages[index].count).toFixed(2);
      const avgTemperature = dailyAverages[index].count === 0 ? 0 : Number(dailyAverages[index].sumTemperature / dailyAverages[index].count).toFixed(2);

      return { soilMoisture: avgSoilMoisture, temperature: avgTemperature, timestamp };
    });

    // Respond with the formatted daily averages
    res.status(200).json({ success: true, data: formattedDailyAverages });
  } catch (error) {
    // Handle any errors
    console.error('Error fetching and calculating daily averages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch and calculate daily averages' });
  }
};


module.exports = {
  insertSensorRecord,
  getSensorRecord,
  getDailyAverages,
};