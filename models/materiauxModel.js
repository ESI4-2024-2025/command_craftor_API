const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materiauxSchema = new Schema({
    number: { type: Number, unique: true },
    nom: { type: String, required: true },
    identifier: { type: String, required: true }
});

materiauxSchema.pre('save', function (next) {
    const doc = this;
    if (doc.isNew) {
        mongoose.model('Materiaux', materiauxSchema).countDocuments(function (err, count) {
            if (err) {
                return next(err);
            }
            doc.number = count + 1;
            next();
        });
    } else {
        next();
    }
});

module.exports = mongoose.model('Materiaux', materiauxSchema);
