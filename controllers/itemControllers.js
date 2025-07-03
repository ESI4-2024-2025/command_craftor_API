const Item = require('../models/itemModel');
const Enchant = require('../models/enchantModel');
const Materiaux = require('../models/materiauxModel');
const Type = require('../models/typeModel');
const Version = require('../models/VersionsModel');
const logger = require('../logger');

/**
 * Get the latest 5 requests sorted by nbutilisation in descending order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getItem = async (req, res) => {
    try {
        // Vérifier si un type est fourni dans la requête (query string ou params)
        const typeFilter = req.query.type || req.params.type;

        // Construire le filtre pour la requête
        const filter = typeFilter ? { type: typeFilter } : {};
        console.log('Filter:', filter);
        // Récupérer les items selon le filtre
        const items = await Item.find(filter)
            .select('identifier enchantement materiaux version type')
            .exec();

        // Peupler manuellement les enchantements et matériaux
        const populatedItems = await Promise.all(items.map(async (item) => {
            const enchantements = await Enchant.find({ number: { $in: item.enchantement } })
                .select('identifier lvlMax version minecraft_id');
            const materiaux = await Materiaux.find({ number: { $in: item.materiaux } })
                .select('identifier version');
            const type = await Type.findOne({ number: item.type })
                .select('name');
            return {
                ...item.toObject(),
                enchantement: enchantements,
                materiaux: materiaux,
                type: type
            };
        }));

        res.status(200).send(populatedItems);
        logger.info('Item information retrieved successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred, Retry Later.");
        logger.error('Item information retrieval failed.', err);
    }
};


/**
 * Add a new item.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
// exports.addItem = async (req, res) => {
//     try {
//         const newItem = new Item(req.body);
//         const savedItem = await newItem.save();
//         res.status(201).send(savedItem);
//         logger.info('Item added successfully.', savedItem.id);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("An error occurred, Retry Later.");
//         logger.error('Item added successfully.', err);
//     }
// };

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
        logger.info('Enchant added successfully', savedEnchant.id);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred, Retry Later.");
        logger.error('Enchant added successfully', err);
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
        logger.info('Materiaux added successfully', savedMateriaux.id);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred, Retry Later.");
        logger.error('Materiaux added successfully', err);
    }
};

exports.addVersion = async (req, res) => {
    try {
        const newVersion = new Version(req.body);
        const savedVersion = await newVersion.save();
        res.status(201).send(savedVersion);
        logger.info('Version added successfully', savedVersion.id);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred, Retry Later.");
        logger.error('Version added successfully', err);
    }
};