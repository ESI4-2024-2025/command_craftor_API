const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    nom: { type: String, required: true, unique: true },
    identifier: { type: String, required: true },
    enchantement: [{ type: Number, ref: 'Enchant' }], // Tableau de Numbers pour enchantement
    materiaux: [{ type: Number, ref: 'Materiaux' }], // Tableau de Numbers pour materiaux
    version: { type: Number, required: true } // Number pour version
});

module.exports = mongoose.model('Item', itemSchema);