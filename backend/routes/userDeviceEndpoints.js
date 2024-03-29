const express = require('express');
const {
  createUserDevice,
  getUserDevices,
  getDeviceSettings,
  updateDeviceSettings,
  deleteUserDevice
  // Add other controller functions as needed...
} = require('../controllers/userDeviceController');

const router = express.Router();

// Create a new user device
router.post('/', createUserDevice);

// Get all user devices for a particular user
router.get('/', getUserDevices);

// Get device settings
router.post('/settings', getDeviceSettings);

// Update Device settings
router.patch('/settings/:deviceId', updateDeviceSettings);

// Delete User Device
router.delete('/:deviceId', deleteUserDevice);

// Add other CRUD endpoints as needed...

module.exports = router;
