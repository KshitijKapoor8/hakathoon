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
        required: true
    },
    flags: {
        type: Array,
        required: false
    }
}, {
    timestamps: true,
})

const PRODUCT = mongoose.model('User', productSchema);
module.exports = User;