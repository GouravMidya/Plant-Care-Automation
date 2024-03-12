const express = require('express')

const {insertSensorRecord,getSensorRecord, getDailyAverages
} = require('../controllers/sensorController')

const router = express.Router()

//insert sensor record
router.post('/',insertSensorRecord);

//Fetch all sensor records
router.get('/',getSensorRecord);

//Fetch only the averages of the records for start date and end date accordingly
router.get('/daily-averages',getDailyAverages);

module.exports = router