// Imports:
const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type:String, 
        required: true, 
        unique: true, 
        match: /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/     // regex expression (username is 8-20 characters long, no _ or . at the beginning, no __ or _. or ._ or .. inside, no _ or . at the end)
    },
    password: {type: String, required: true}
});

// Constructor:
module.exports = mongoose.model('User', userSchema);