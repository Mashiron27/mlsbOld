// Imports:
const mongoose = require('mongoose');
const sensorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,   // Guid
    name: {type: String, required: true},   // Only accepts string types and makes the field mandatory
    location: {type: String, required: true},   // Or Number instead of String, depends on how I'll name the locations.
    sensorImage: {type: String, required: false}
});

// Constructor:
module.exports = mongoose.model('Sensor', sensorSchema);