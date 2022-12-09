const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userShema = mongoose.Schema({
    'userName': { type: String, required: false },
    'firstName': { type: String, required: false },
    'lastName': { type: String, required: false },
    'email': { type: String, required: true, unique: true },
    'password': { type: String, required: true },
    'avatar': { type: Number, required: false },
    'createdAt': { type: Date, default: Date.now() }



})

userShema.plugin(uniqueValidator) // email soit unique

module.exports = mongoose.model('User', userShema) // modele de donnee