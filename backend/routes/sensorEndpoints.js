const express = require('express')

const {insertSensorRecord,getAllSensorRecords, getAverageTemperature, getAverageSoilMoisture, getAllTemperatureRecords, getAllSoilMoistureRecords
} = require('../controllers/sensorController')

const router = express.Router()

//insert sensor record
router.post('/',insertSensorRecord);

//Fetch all sensor records for a particular deviceId
router.get('/',getAllSensorRecords);

//Fetch only the averages of the temperature records for start date and end date accordingly for a particular deviceId
router.get('/avgtemp',getAverageTemperature);

//Fetch only the averages of the soil moisture records for start date and end date accordingly for a particular deviceId
router.get('/avgsoilmoisture',getAverageSoilMoisture);

//Fetch all temperature records for start date and end date accordingly for a particular deviceId
router.get('/alltemp',getAllTemperatureRecords);

//Fetch all the temperature records for start date and end date accordingly for a particular deviceId
router.get('/allsoilmoisture',getAllSoilMoistureRecords);


module.exports = router