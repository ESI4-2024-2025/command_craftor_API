const blocModels = require('../models/blocModel');

/**
 * Get the latest 5 requests sorted by nbutilisation in descending order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getBloc = async (req, res) => {
    try {
        const docs = await blocModels.find();

        res.status(200).send(docs);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving the current profile.');
    }
};