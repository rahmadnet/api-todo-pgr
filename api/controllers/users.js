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
                    message: "Email Already Exists"
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
                return res.status(401).json([{
                    status: false,
                    message: "Login failed",
                    data: {}
                }]);
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json([{
                        status: false,
                        message: "Login failed",
                        data: {}
                    }]);
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

// DATA PROFILE USER
exports.user_profile = (req, res, next) => {
    User.find().select('_id nama asal no_hp email')
    .exec().then(docs => {
        const response = {
            count: docs.length,
            user: docs.map(doc => {
                return {
                    status: true,
                    message: "Success",
                    data: {
                        _id: doc._id,
                        nama: doc.nama,
                        asal: doc.asal,
                        no_hp: doc.no_hp,
                        email: doc.email
                    }
                }
            })

        };
        res.status(200).json(response);
    }).catch(err => {
        res.status(500).json({
            status: false,
            message: "Failed",
            data: []
        });
    });
};
// DATA LOGOUT
// exports.user_logout = (req, res, next) => {
//     User.find({
//         _id: req.params.userId
//     })
//     .exec()
//     .then( result => {
//         if (result) {
//             const token = jwt.sign({
//                 userId: user[0]._id
//             },process.env.JWT_KEY, {
//                 expiresIn: "5s"
//             });
//             res.status(200).json([{
//                 status: true,
//                 message: "Logout success",
//                 token: token
//             }]);
//         }
//     }).catch( err => {
//         res.status(500).json([{
//             status: true,
//             message: "Logout Failed"
//         }]);
//     });
// };