const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materiauxSchema = new Schema({
    number: { type: Number, required: true },
    nom: { type: String, required: true },
    identifier: { type: String, required: true }
});

module.exports = mongoose.model('Materiaux', materiauxSchema);
