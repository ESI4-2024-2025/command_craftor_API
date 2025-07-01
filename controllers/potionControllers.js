const logger = require('../logger');
const potionModels = require('../models/potionModel');

/**
 * Get the latest 5 requests sorted by nbutilisation in descending order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getPotion = async (req, res) => {
    try {
        const docs = await potionModels.find();
        res.status(200).send(docs);
        logger.info('Potion information retrieved successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving the current profile.');
        logger.error('Potion information not retrieved.');
    }
};