const mongoose = require('mongoose');

const { Schema } = mongoose;

const enchantSchema = Schema({
    number: { type: Number, unique: true },
    identifier: { type: String, required: true },
    lvlMax: { type: Number, required: true },
    version: { type: Number, ref: 'Version' }, // Single Number for version
    minecraft_id: { type: Number } // minecraft_id field
});

enchantSchema.pre('save', function (next) {
    const doc = this;
    if (doc.isNew) {
        mongoose.model('Enchant', enchantSchema).findOne({}, {}, { sort: { number: -1 } }, function (err, lastEnchant) {
            if (err) {
                return next(err);
            }
            doc.number = lastEnchant ? lastEnchant.number + 1 : 1;
            next();
        });
    } else {
        next();
    }
});

module.exports = mongoose.model('Enchant', enchantSchema);