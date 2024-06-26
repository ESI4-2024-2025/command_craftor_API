const mongoose = require('mongoose');

const { Schema } = mongoose;

const versionschema = Schema({
    number: { type: Number, required: true, unique: true },
    name: { type: Number, required: true },
    version: { type: String, required: true },
});

module.exports = mongoose.model('versions', versionschema);