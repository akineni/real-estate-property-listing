const mongoose = require('mongoose')

module.exports = {
    userSchema: new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }),

    propertySchema: new mongoose.Schema({
        now: {
            type: Date,
            default: () => {  return Date.now() }
        }
    }, { strict: false })
}