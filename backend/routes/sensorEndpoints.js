const express = require('express');
const { insertSensorRecord, getSensorRecords } = require('../controllers/sensorController');

const router = express.Router();

// Insert sensor record
router.post('/', insertSensorRecord);

// Get sensor records
router.get('/', getSensorRecords);

module.exports = router;
