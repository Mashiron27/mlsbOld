// Imports:
const express = require('express');
const app = express();
const morgan = require('morgan');   // Logging
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const sensorRoutes = require('./api/routes/sensors');
const notificationRoutes = require('./api/routes/notifications');
const userRoutes = require('./api/routes/user');

// Connection string for MongoDB:
mongoose.connect('mongodb+srv://'
    + process.env.MONGO_ATLAS_USR
    + ':' 
    + process.env.MONGO_ATLAS_PWD
    + '@mlsb-app.q09hq.mongodb.net/<dbname>?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
mongoose.Promise = global.Promise;  // Avoid some deprecationWarning in the logs, use the Default Node.js implementation instead of the mongoose one
mongoose.set('useCreateIndex', true); // Avoid another deprecationWarning.

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));  // Access route to the uploads folder (made it public).
app.use(bodyParser.urlencoded({extended: false}));  // Extract json data and make it readable for us.
app.use(bodyParser.json());

app.use((req, res, next) => {   // Prevent CORS (Cross Origin Resource Sharing) errors.
    res.header('Access-Control-Allow-Origin', '*'); // * -> To be changed with my domain (only).
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests (middleware):
app.use('/sensors', sensorRoutes);  // Anything that has /sensors in link will be handled by sensorRoutes.
app.use('/notifications', notificationRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

// Handle any other errors that might be shown through the application:
app.use((error, req, res, next) => {
    res.status(error.status || 500);  // The previous error or 500.
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;