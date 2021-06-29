const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require('../routes/model/user');
const user = require('../routes/model/user');

// Register
exports.user_register = (req, res, next) => {
    User.find({
            email: req.body.email
        }).exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json([{
                    status: false,
                    message: "Mail Exist"
                }]);
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            nama: req.body.nama,
                            asal: req.body.asal,
                            no_hp: req.body.no_hp,
                            email: req.body.email,
                            password: hash,
                            role: "member"
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json([{
                                    status: true,
                                    message: "Register succsess"
                                }]);
                            }).catch(err => {
                                console.log(err);
                                res.status(500).json([{
                                    status: false,
                                    message: "Register failed"
                                }]);
                            });
                    }
                });
            }
        })
};

// Login
exports.user_login = (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth Failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "365d"
                    });
                    return res.status(200).json([{
                        status: true,
                        mesaage: "LoginSucess",
                        data: {
                            _id: new mongoose.Types.ObjectId,
                            role: req.body.role,
                            token: token
                        }
                    }]);
                }
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json([{
                status: false,
                message: "Login Failed",
                data: {}
            }]);
        });
};