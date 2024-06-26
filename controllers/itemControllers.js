const Item = require('../models/itemModel');
const Enchant = require('../models/enchantModel');
const Materiaux = require('../models/materiauxModel');

/**
 * Get the latest 5 requests sorted by nbutilisation in descending order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getItem = async (req, res) => {
    try {
        const items = await Item.find()
            .select('Nom identifier enchantement materiaux')
            .exec();

        const populatedItems = await Promise.all(items.map(async (item) => {
            const enchantements = await Enchant.find({ number: { $in: item.enchantement } }).select('nom identifier lvlMax');
            const materiaux = await Materiaux.find({ number: { $in: item.materiaux } }).select('nom identifier');

            return {
                ...item.toObject(),
                enchantement: enchantements,
                materiaux: materiaux
            };
        }));

        // console.log('items : ', items);
        // console.log('populatedItems : ', populatedItems);
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