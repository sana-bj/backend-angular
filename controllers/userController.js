const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')


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
            console.log(newUser);
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

    login: (req, res) => {

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

    }
}