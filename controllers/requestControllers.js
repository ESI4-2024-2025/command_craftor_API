const requestModels = require('../models/requestModel')
//================ Get ======================//

/**
 * Get the latest 5 requests sorted by nbutilisation in descending order.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getRequest = async (req, res) => {
  try {
    requestModels.find()
      .sort({ nbutilisation: -1 })
      .limit(5)
      .exec((err, docs) => {
        if (!err) {
          res.status(200).send(docs);
        } else {
          res.status(403);
          console.log('Error while finding the data' + JSON.stringify(err, undefined, 2));
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving the current profile.');
  }
};

//================ Post ======================//

/**
 * Create or update a request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.Request = async (req, res) => {
  try {
    // Vérifier si la Command est vide
    if (req.body.Command === null || req.body.Command === undefined || req.body.Command === '') {
      return res.status(400).json({ errors: "La Commande ne peut pas être vide" });
    }
    // Vérifier si la version est vide
    if (req.body.Version === null || req.body.Version === undefined || req.body.Version === '') {
      return res.status(400).json({ errors: "La version ne peut pas être vide" });
    }

    // Vérifier si la Command existe
    const existingRequest = await requestModels.findOne({ command: req.body.Command });
    if (existingRequest) {
      // Mettre à jour la Command existante
      if (existingRequest.version.includes(req.body.Version)) {
        existingRequest.nbutilisation += 1;
        const updatedRequest = await existingRequest.save();
        return res.status(200).send(updatedRequest);
      }
      const updatedRequest = await requestModels.findByIdAndUpdate(existingRequest._id, {
        $set: {
          version: [...existingRequest.version, req.body.Version],
          nbutilisation: existingRequest.nbutilisation + 1
        }
      }, { new: true });
      res.status(200).send(updatedRequest);
    } else {
      // Ajouter la nouvelle requête à la liste
      const newRequest = new requestModels({
        command: req.body.Command,
        version: req.body.Version,
        nbutilisation: 1
      });
      const savedRequest = await newRequest.save();
      res.status(200).send(savedRequest);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Erreur lors de l\'enregistrement de la requête Veuillez réessayer plus tard.');
  }
};