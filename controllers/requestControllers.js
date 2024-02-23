const requestModels = require('../models/requestModel')

//================ Get ======================//
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
exports.Request = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.Commande === null || req.body.Commande === undefined || req.body.Commande === '') {
      return res.status(400).json({ errors: "La commande ne peut pas être vide" });
    }
    if (req.body.Version === null || req.body.Version === undefined || req.body.Version === '') {
      return res.status(400).json({ errors: "La version ne peut pas être vide" });
    }
    console.log(req.body.Commande);
    // Vérifier si la commande existe
    const existingRequest = await requestModels.findOne({ command: req.body.Commande });
    if (existingRequest) {
      // Mettre à jour la commande existante
      if (existingRequest.version.includes(req.body.Version)) {
        return res.status(400).json({ errors: "La version existe déjà" });
      }
      const updatedRequest = await requestModels.findByIdAndUpdate(existingRequest._id, {
        $set: {
          version: [...existingRequest.version, req.body.Version],
          nbutilisation: existingRequest.nbutilisation + 1
        }
      }, { new: true });
      console.log(updatedRequest);
      res.status(200).send(updatedRequest);
    } else {
      // Ajouter la nouvelle requête à la liste
      const newRequest = new requestModels({
        command: req.body.Commande,
        version: req.body.Version,
        nbutilisation: 1
      });
      const savedRequest = await newRequest.save();
      console.log(savedRequest);
      res.status(200).send(savedRequest);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Erreur lors de l\'enregistrement de la requête Veuillez réessayer plus tard.');
  }
};