const express = require('express');
const { insertPumpHistory, getLatestPumpHistory, getPumpHistoryByTimeRange } = require('../controllers/pumpController');

const router = express.Router();

// Insert pump history record
router.post('/', insertPumpHistory);

// Get the latest pump history record for a given deviceId
router.post('/latest', getLatestPumpHistory);

// Get pump history records for a given time range
router.get('/history', getPumpHistoryByTimeRange);

module.exports = router;
