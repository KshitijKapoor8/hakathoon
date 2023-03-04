const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    ingredients: {
        type: Array,
        required: false
    },
    score: {
        type: Number,
        required: false
    },
    flags: {
        type: Array,
        required: false
    }
}, {
    timestamps: true,
})

const PRODUCT = mongoose.model('Pr', productSchema);
module.exports = PRODUCT;