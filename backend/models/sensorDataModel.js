const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  sensorType: { type: String, required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' }
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
