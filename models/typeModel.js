const mongoose = require('mongoose');
const { Schema } = mongoose;

const typeSchema = new Schema({
    number: { type: Number, required: true },
    name: { type: String,  required: true}, // Tableau de Numbers pour enchantement
});

module.exports = mongoose.model('Type', typeSchema);