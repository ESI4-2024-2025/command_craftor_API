const mongoose = require('mongoose');

const { Schema } = mongoose;

const enchantSchema = Schema({
    number: { type: Number, required: true, unique: true },
    nom: { type: String, required: true },
    identifier: { type: String, required: true },
    lvlMax: { type: Number, required: true },
});

module.exports = mongoose.model('Enchant', enchantSchema);
