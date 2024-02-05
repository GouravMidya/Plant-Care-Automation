const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  type: { type: String, required: true },
  variety: { type: String },
  plantingDate: { type: Date },
  harvestDate: { type: Date },
  optimalSoilMoisture: { type: Number },
  optimalTemperature: { type: Number },
  otherOptimalConditions: { type: String }
});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;
