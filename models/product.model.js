const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productShema = mongoose.Schema({
    'name': { type: String, required: true },
    'description': { type: String, required: true },
    'price': { type: Number, required: true },
    'stock': { type: Number, required: true },
    'image': { type: String, required: true },
    'createAt': { type: Date, default: Date.now() },
    /*'userId': {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }*/

})

module.exports = mongoose.model('Product', productShema) // modele de donnee