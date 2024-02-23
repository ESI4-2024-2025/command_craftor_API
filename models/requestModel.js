const mongoose = require('mongoose')

const { Schema } = mongoose

const requestSchema = Schema({
    command: { type: String, required: true, },
    version: { type: Array, required: true },
    nbutilisation: { type: Number, required: false, default: 0 },
})

module.exports = mongoose.model('request', requestSchema, 'request')
