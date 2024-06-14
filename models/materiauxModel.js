const mongoose = require('mongoose');

const { Schema } = mongoose;

const materiauxSchema = Schema({
    number: { type: Number, required: true, unique: true },
    nom: { type: String, required: true },
    identifier: { type: String, required: true },
});

module.exports = mongoose.model('Type', materiauxSchema);