const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a Username'],
    },
    email: {
        type: String,
        required: [true, 'Enter an email address'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Enter a password for the account'],
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)