// Imports: 
const mongoose = require('mongoose');
const Sensor = require('../models/sensor');

// Get all sensors:
exports.sensors_get_all = (req, res, next) => {
    Sensor.find()
    .select('name location _id sensorImage')    // Filter what we want to show.
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            sensors: docs.map(doc => {
                return {
                    name: doc.name,
                    location: doc.location,
                    sensorImage: doc.sensorImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/sensors/' + doc._id
                    }
                }
            })
        }
        if (docs.length > 0) {
            res.status(200).json(response);
        }
        else {
            res.status(200).json({
                message: 'No data here, sir.'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

// Create one sensor:
exports.sensors_create_one = (req, res, next) => {    // upload.single - middleware for a single upload.
    console.log(req.file);
    const sensor = new Sensor({ // Constructor.
        _id: new mongoose.Types.ObjectId(), // Automatically give a Primary Key
        name: req.body.name,
        location: req.body.location,
        sensorImage: req.file.path
    });
    sensor.save()
    .then(result => {  // Method used to store this in the DB
        console.log(result);
        res.status(201).json({  // Status 201 to properly say that the post went well.
            message: 'Created sensor sucessfuly.',
            createdSensor: {
                name: result.name,
                location: result.location,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/sensors/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

// Get the details for one specific sensor:
exports.sensors_get_one = (req, res, next) => {
    const id = req.params.sensorId;
    Sensor.findById(id)
    .select('name location _id sensorImage')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                sensor: doc,
                request: {
                    type: 'GET',
                    description: 'GET_ALL_PRODUCTS',
                    url: 'http://localhost:3000/sensors/'
                }
            });
        }
        else {
            res.status(404).json({
                message: 'No valid entry found for provided ID'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
};

// Update the data for one specific sensor:
exports.sensors_update_one = (req, res, next) => {
    const id = req.params.sensorId;
    const updateOps = {}
    for (const key in req.body) {  // Send different types of PATCH requests.
        updateOps[key] = req.body[key]
    }
    Sensor.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Sensor updated!',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/sensors/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

// Delete one specific sensor:
exports.sensors_delete_one = (req, res, next) => {
    const id = req.params.sensorId;
    Sensor.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted!',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/sensors/',
                body: { name: 'String', location: 'String' }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
};