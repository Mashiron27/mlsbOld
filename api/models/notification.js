const mongoose = require('mongoose');
const notificationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    sensor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true },
    description: { type: String, required: false },
    severity: { type: Number, required: false }
});

module.exports = mongoose.model('Notification', notificationSchema);