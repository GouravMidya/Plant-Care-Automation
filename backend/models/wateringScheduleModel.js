const mongoose = require('mongoose');

const wateringScheduleSchema = new mongoose.Schema({
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
  wateringTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false }
});

const WateringSchedule = mongoose.model('WateringSchedule', wateringScheduleSchema);

module.exports = WateringSchedule;
