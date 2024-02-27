const UserDevice = require('../models/UserDeviceModel');

// Controller function to create a new user device
const createUserDevice = async (req, res) => {
  try {
    const { userId, deviceId, checkIntervals, pumpDuration } = req.body;
    const newUserDevice = new UserDevice({ userId, deviceId, checkIntervals, pumpDuration });
    await newUserDevice.save();
    res.status(201).json({ success: true, message: 'User device created successfully', data: newUserDevice });
  } catch (error) {
    console.error('Error creating user device:', error);
    res.status(500).json({ success: false, message: 'Failed to create user device' });
  }
};

// Controller function to get all user devices
const getUserDevices = async (req, res) => {
  try {
    const userDevices = await UserDevice.find();
    res.status(200).json({ success: true, data: userDevices });
  } catch (error) {
    console.error('Error getting user devices:', error);
    res.status(500).json({ success: false, message: 'Failed to get user devices' });
  }
};

// Controller function to fetch device settings
const getDeviceSettings = async (req, res) => {
  try {
    const { deviceId } = req.body;
    const device = await UserDevice.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    res.status(200).json({ success: true, checkIntervals: device.checkIntervals, pumpDuration: device.pumpDuration });
  } catch (error) {
    console.error('Error fetching device settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch device settings' });
  }
};

// Add other CRUD operations as needed...

module.exports = {
  createUserDevice,
  getUserDevices,
  getDeviceSettings
  // Add other controller functions here...
};
