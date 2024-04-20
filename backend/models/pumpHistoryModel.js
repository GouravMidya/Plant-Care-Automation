const mongoose = require('mongoose');

const pumpHistorySchema = new mongoose.Schema({
  deviceId: {
    type: Number,
    ref: 'UserDevice', // Reference to the UserDevice model
    required: true
  },
  pumpDuration: {
    type: Number,
    required: true
  },
  threshold:{
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const PumpHistory = mongoose.model('PumpHistory', pumpHistorySchema);

module.exports = PumpHistory;