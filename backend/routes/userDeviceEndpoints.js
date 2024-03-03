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

// Get all user devices
router.get('/', getUserDevices);

// Get device settings
router.post('/settings', getDeviceSettings);

// Update Device settings
router.patch('/settings', updateDeviceSettings);

// Update Device settings
router.delete('/settings', deleteDeviceSettings);

// Add other CRUD endpoints as needed...

module.exports = router;
