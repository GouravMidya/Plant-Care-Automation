const express = require('express')

const {insertSensorRecord,getSensorRecord
} = require('../controllers/sensorController')

const router = express.Router()

//insert sensor record
router.post('/',insertSensorRecord);
router.get('/',getSensorRecord);

module.exports = router