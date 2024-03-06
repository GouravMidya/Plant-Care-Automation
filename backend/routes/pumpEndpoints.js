const express = require('express');
const { insertPumpHistory } = require('../controllers/pumpController');

const router = express.Router();

// Insert pump history record
router.post('/', insertPumpHistory);

module.exports = router;
