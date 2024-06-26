const mongoose = require('mongoose');

const { Schema } = mongoose;

const versionschema = Schema({
    number: { type: Number, unique: true },
    value: { type: Number, required: true },
    version: { type: String, required: true },
});

versionschema.pre('save', function (next) {
    const doc = this;
    if (doc.isNew) {
        mongoose.model('versions', versionschema).findOne({}, {}, { sort: { number: -1 } }, function (err, lastVersion) {
            if (err) {
                return next(err);
            }
            doc.number = lastVersion ? lastVersion.number + 1 : 1;
            next();
        });
    } else {
        next();
    }
});

module.exports = mongoose.model('versions', versionschema);