const mongoose = require('mongoose');

const userDeviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: Number,
    unique: true,
    required: true
  },
  deviceName: {
    type: String, // Assuming device name is a string
    required: true
  },
  location: {
    type: String, // Assuming location is a string
    required: false
  },
  description: {
    type: String, // Assuming description is a string
    required: false
  },
  checkIntervals: {
    type: Number,
    required: true
  },
  pumpDuration: {
    type: Number,
    required: true
  },
  threshold: { 
    type: Number,
    default: 450 
  }
});

const UserDevice = mongoose.model('UserDevice', userDeviceSchema);

module.exports = UserDevice;
