const express = require('express');
const { insertSensorRecord, getSensorRecord } = require('../controllers/sensorController');
const router = express.Router();

// Insert sensor record
router.post('/', insertSensorRecord);

// Get sensor records
router.get('/', getSensorRecord);

module.exports = router;