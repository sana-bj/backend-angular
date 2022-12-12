const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const jsforce = require("jsforce");



module.exports = {

    signup: (req, res) => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: err.message
                })
            }
            console.log('oook');
            const newUser = new userModel({
                    email: req.body.email,
                    password: hash
                })
                // console.log(newUser);
            newUser.save((err, user) => {

                if (err) {
                    return res.status(400).json({
                        status: 400,
                        message: 'err.message'
                    })
                }

                return res.status(201).json({
                    status: 201,
                    message: 'user signup'
                })

            })
        })



    },

    login2: (req, res) => {

        userModel.findOne({ email: req.body.email }, (err, user) => {

            if (err) {
                return res.status(400).json({
                    status: 400,
                    message: 'user not found'
                })

            }

            if (!user) {
                return res.status(400).json({
                    status: 400,
                    message: 'user not found'
                })
            }
            console.log(req.body);
            bcrypt.compare(req.body.password, user.password, (err, valid) => {

                if (err) {
                    return res.status(500).json({
                        status: 500,
                        message: err.message
                    })
                }
                if (!valid) {
                    return res.status(400).json({
                        status: 400,
                        message: 'bad pwd'
                    })

                }

                return res.status(200).json({
                    status: 200,
                    userId: user._id,
                    token: jsonwebtoken.sign({ userId: user._id },
                        process.env.TOKEN_SECRET, { expiresIn: '24h' }

                    )
                })

            })


        })

    },

    login: (req, res) => {
        // Log in with basic SOAP login (see documentation for other auth options)

        const conn = new jsforce.Connection({
            // you can change loginUrl to connect to sandbox or tprerelease env.
            loginUrl: "https://login.salesforce.com/"
        });
        var token = 'Y25QT45SVi3rQ2Luu17mrMz51';
        var pwd = req.body.password;
        var email = req.body.email;
        console.log(req.body);
        var auth = true;
        conn.login(email, pwd + token,
            (err) => {
                if (err) {
                    auth = false;
                    return res.status(400).json({
                        status: 400,
                        message: 'user not foun'

                    })
                }
                //console.log(res);
                console.log("Successfully logged in!");
                return res.status(200).json({
                        status: 200,
                        message: 'user connecte'

                    })
                    // Run a SOQL query

            }
        );

    }
}