//sensitive info hiding
require('dotenv').config()

//framework and database operations
const express = require('express')
const mongoose = require('mongoose')

// Import routes
const sensorRoutes = require('./routes/sensorEndpoints');
const userRoutes = require('./routes/userEndpoints');
const userDeviceRoutes = require('./routes/userDeviceEndpoints');

//express app
const app = express()

//middleware
app.use(express.json())

app.use((req,res,next) =>{
    console.log(req.path,req.method,req.body)
    next()
})

//routes
app.use('/sensor_readings', sensorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user_devices', userDeviceRoutes);

//mongodb
mongoose.connect(process.env.MONG_URI)
    .then(() =>{
        app.listen(process.env.PORT, () =>{
            console.log("Server listening on port ",process.env.PORT)
        })
    })
    .catch((error) =>{
        console.log(error.message)
    })

