const express = require('express')

const {insertSensorRecord,
} = require('../controllers/sensorController')

const router = express.Router()

//insert sensor record
router.post('/',insertSensorRecord);

module.exports = router