const mongoose = require('mongoose');

const sensorRecordSchema = new mongoose.Schema({
  deviceId: {
    type: Number,
    ref: 'UserDevice',
    required: true
  },
  soilMoisture: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const SensorRecord = mongoose.model('SensorRecord', sensorRecordSchema);

module.exports = SensorRecord;
