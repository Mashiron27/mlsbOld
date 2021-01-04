// Imports:
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup:
exports.user_signup = (req, res, next) => {
    User.find({username: req.body.username})
    .exec()
    .then(user => {
        if (user.length > 0) {
            return res.status(409).json({
                message: 'Username already in use.'
            });
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {       // adds 10 more random words to make it harder to de-hash
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created!'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    });
                }
            });
        }
    });
};

// Login:
exports.user_login = (req, res, next) =>{
    User.find({username: req.body.username})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed.'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed.'
                });
            }
            if (result) {
                const token = jwt.sign({
                    username: user[0],
                    userId: user[0]._id
                }, 
                process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: 'Auth successful.',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed.'
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
};

// Delete user:
exports.user_delete_one = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted.'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
};