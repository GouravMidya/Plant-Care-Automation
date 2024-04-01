const UserDevice = require('../models/UserDeviceModel');

// Controller function to create a new user device
const createUserDevice = async (req, res) => {
  try {
    const { userId, deviceId, checkIntervals, pumpDuration, location, description, deviceName, threshold} = req.body;
    const newUserDevice = new UserDevice({ userId, deviceId, checkIntervals, pumpDuration, location, description, deviceName, threshold });
    await newUserDevice.save();
    res.status(201).json({ success: true, message: 'User device created successfully', data: newUserDevice });
  } catch (error) {
    console.error('Error creating user device:', error);
    res.status(500).json({ success: false, message: 'Failed to create user device' });
  }
};

// Controller function to get all user devices for a particular user
const getUserDevices = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const userDevices = await UserDevice.find({ userId });
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
    res.status(200).json({ success: true, data: device });
  } catch (error) {
    console.error('Error fetching device settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch device settings' });
  }
};

// Controller function to update device settings
const updateDeviceSettings = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const {
      deviceName,
      checkIntervals,
      pumpDuration,
      location,
      description,
      threshold,
    } = req.body;

    const device = await UserDevice.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    if (deviceName !== undefined) {
      device.deviceName = deviceName;
    }
    if (checkIntervals !== undefined) {
      device.checkIntervals = checkIntervals;
    }
    if (pumpDuration !== undefined) {
      device.pumpDuration = pumpDuration;
    }
    if (location !== undefined) {
      device.location = location;
    }
    if (description !== undefined) {
      device.description = description;
    }

    if (threshold !== undefined) {
      device.threshold = threshold; 
    }

    await device.save();
    return res.status(200).json({ success: true, message: 'Device settings updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating device settings' });
  }
};

// Controller function to delete a device
const deleteUserDevice = async (req, res) => {
  try {
    const { deviceId } = req.params; // Retrieve deviceId from URL parameters
    const device = await UserDevice.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    // Delete the device
    await device.remove(); 
    res.status(200).json({ success: true, message: 'Device deleted successfully' });

  } catch (error) {
    console.error('Error deleting user device:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user device' });
  }
};
module.exports = {
  createUserDevice,
  getUserDevices,
  getDeviceSettings,
  updateDeviceSettings,
  deleteUserDevice
  // Add other controller functions here...
};
