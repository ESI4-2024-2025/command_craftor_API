const Version = require('../models/VersionsModel');

// Récupérer toutes les versions
exports.getAllVersions = async (req, res) => {
    try {
        const versions = await Version.find().sort({ value: -1 });
        res.status(200).json(versions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des versions', error });
    }
};