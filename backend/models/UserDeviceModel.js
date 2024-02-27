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
  checkIntervals: {
    type: Number,
    required: true
  },
  pumpDuration: {
    type: Number,
    required: true
  }
});

const UserDevice = mongoose.model('UserDevice', userDeviceSchema);

module.exports = UserDevice;
