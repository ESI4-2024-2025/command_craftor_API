const Item = require('./itemModel');
const Enchant = require('./enchantModel');
const Materiaux = require('./materiauxModel');

/**
 * Get the latest 5 requests sorted by nbutilisation in descending order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getItem = async (req, res) => {
    try {
        Item.find()
            .select('Nom identifier enchantement materiaux') // Sélectionnez les champs souhaités de Item
            .exec(async (err, items) => {
                if (err) {
                    console.error(err);
                    return;
                }

                // Pour chaque item, peupler manuellement enchantement et materiaux
                const populatedItems = await Promise.all(items.map(async (item) => {
                    const enchantements = await Enchant.find({ number: { $in: item.enchantement } }).select('nom identifier lvlMax');
                    const materiaux = await Materiaux.find({ number: { $in: item.materiaux } }).select('nom identifier');
                    return {
                        ...item.toObject(), // Convertir l'item en objet simple
                        enchantement: enchantements,
                        materiaux: materiaux
                    };
                }));

                console.log(populatedItems);
            });
        res.status(200).send(populatedItems);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving the current profile.');
    }
};





