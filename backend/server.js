//sensitive info hiding
require('dotenv').config()
//framework and database operations
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');


//express app
const app = express()
const PORT = process.env.PORT || 5000;


//middleware
app.use(express.json())
app.use(cors())

// Import routes
const sensorRoutes = require('./routes/sensorEndpoints');
//const userRoutes = require('./routes/userEndpoints');
const userDeviceRoutes = require('./routes/userDeviceEndpoints');
const pumpRoutes = require('./routes/pumpEndpoints')
const blogRoutes =require('./routes/blogPostEndpoints');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');


app.use((req,res,next) =>{
    // Get the current date and time
    const now = new Date();
    
    console.log("Request timestamp: ",now.toLocaleString())
    console.log(req.path,req.method,req.body)
    next()
})

//routes
app.use('/sensor_readings', sensorRoutes);
//app.use('/api/users', userRoutes);
app.use('/api/user_devices', userDeviceRoutes);
app.use('/pump',pumpRoutes);
app.use('/blogs',blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/products',productRoutes);
app.use('/contact',contactRoutes);

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

