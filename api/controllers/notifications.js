// Imports: 
const mongoose = require('mongoose');
const Notification = require('../models/notification');
const Sensor = require('../models/sensor');

// Get * notifications - controller:
exports.notifications_get_all = (req, res, next) => {
    Notification.find()
    .select('name sensor description severity')
    .populate('sensor', 'name')        // On the sensor field, also populated the sensor data.
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            notifications: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    sensor: doc.sensor,
                    description: doc.description,
                    severity: doc.severity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/notifications/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

// Create a notification:
exports.notifications_create_notification = (req, res, next) => {
    Sensor.findById(req.body.sensor)
    .then(sensor => {
        if (!sensor) {
            return res.status(404).json({
                message: 'Sensor not found!'
            });
        }
        const notification = new Notification({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            sensor: req.body.sensor,
            description: req.body.description || null,
            severity: req.body.severity || 1
        });
        return notification.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Notificaiton added!',
            createdNotification: {
                _id: result._id,
                name: result.name,
                sensor: result.sensor,
                description: result.description,
                severity: result.severity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/notifications/' + result._id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

// Get the details of one notification:
exports.notifications_get_one = (req, res, next) => {
    Notification.findById(req.params.notificationId)
    .populate('sensor', 'name location')
    .exec()
    .then(notification => {
        if (!notification) {
            return res.status(404).json({
                message: 'Notification not found!'
            });
        }
        res.status(200).json({
            notification: notification,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/notifications/'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

// Delete a specific notification:
exports.notifications_delete_one = (req, res, next) => {
    Notification.deleteOne({ _id: req.params.notificationId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Notification deleted.',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/notifications/',
                body: { sensor: 'Guid', name: 'String' }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
};