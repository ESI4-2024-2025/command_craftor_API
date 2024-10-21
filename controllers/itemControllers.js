const Item = require('../models/itemModel');
const Enchant = require('../models/enchantModel');
const Materiaux = require('../models/materiauxModel');
const Version = require('../models/VersionsModel');

/**
 * Get the latest 5 requests sorted by nbutilisation in descending order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getItem = async (req, res) => {
    try {
        // Récupérer tous les items
        const items = await Item.find()
            .select('nom identifier enchantement materiaux')
            .exec();

        // Peupler manuellement les enchantements et matériaux
        const populatedItems = await Promise.all(items.map(async (item) => {
            const enchantements = await Enchant.find({ number: { $in: item.enchantement } }).select('nom identifier lvlMax version minecraft_id');
            const materiaux = await Materiaux.find({ number: { $in: item.materiaux } }).select('nom identifier');

            // Peupler les versions pour chaque enchantement
            const populatedEnchantements = await Promise.all(enchantements.map(async (enchant) => {
                const versions = await Version.find({ number: { $in: enchant.version } }).select('name version');
                return {
                    ...enchant.toObject(),
                    version: versions
                };
            }));

            return {
                ...item.toObject(),
                enchantement: populatedEnchantements,
                materiaux: materiaux
            };
        }));

        res.status(200).send(populatedItems);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred, Retry Later.");
    }
};


/**
 * Add a new item.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.addItem = async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.status(201).send(savedItem);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred, Retry Later.");
    }
};

/**
 * Add a new enchant.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.addEnchant = async (req, res) => {
    try {
        const newEnchant = new Enchant(req.body);
        const savedEnchant = await newEnchant.save();
        res.status(201).send(savedEnchant);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred, Retry Later.");
    }
};

/**
 * Add a new materiaux.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.addMateriaux = async (req, res) => {
    try {
        const newMateriaux = new Materiaux(req.body);
        const savedMateriaux = await newMateriaux.save();
        res.status(201).send(savedMateriaux);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred, Retry Later.");
    }
};

exports.addVersion = async (req, res) => {
    try {
        const newVersion = new Version(req.body);
        const savedVersion = await newVersion.save();
        res.status(201).send(savedVersion);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred, Retry Later.");
    }
};