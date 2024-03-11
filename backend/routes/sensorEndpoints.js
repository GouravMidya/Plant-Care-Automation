const express = require('express')

const {insertSensorRecord,getSensorRecord, getDailyAverages
} = require('../controllers/sensorController')

const router = express.Router()

//insert sensor record
router.post('/',insertSensorRecord);
router.get('/',getSensorRecord);
router.get('/daily-averages',getDailyAverages);

module.exports = router