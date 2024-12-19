const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = Schema({
    username: { type: String, required: true, },
    email: { type: String, required: true },
    password: { type: String, required: true },
    email_verified: { type: Boolean, required: false, default: false },
    favoris: { type: Array, required: false, default: null },
})

module.exports = mongoose.model('Users', userSchema, 'Users')
