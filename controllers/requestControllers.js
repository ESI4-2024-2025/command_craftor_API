const ObjectID = require('mongoose').Types.ObjectId
const jwt = require('jsonwebtoken')
const { body, validationResult, check } = require('express-validator');
const requestModels = require('../models/requestModel')
const accessTokenSecret = process.env.TOKEN_SECRET
const axios = require('axios');
const https = require("https");

//================ Get ======================//
exports.getRequest = async (req, res) => {
  try {
    requestModels.findOne((err, docs) => {
      if (!err) {
        /* #swagger.responses[200] = {
            description: "Récupérer le profil de l'utilisateur courant.",
            schema: {
              "_id": "644ba18b59abc94a82f90e53",
              "username": "ilhan",
              "email": "ilhan.koprulu@ecole-isitech.fr",
              "phone": "0708090405",
              "email_verified": false,
              "__v": 0
            }
        } */
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

//================ Delete ======================//
exports.deleteRequest = (req, res) => {
  try {
    const id = req.body._id;

    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: process.env.LINK_API + '/user/delete',
      headers: {
        'X-User-ID': id
      },
    };

    if (!ObjectID.isValid(id)) {
      return res.status(400).send(`No record with given id: ${id}`);
    }

    requestModels.findByIdAndRemove(id, async (err, docs) => {
      if (!err) {
        const result = {
          data: docs,
          message: 'Post has been removed successfully.',
          status: 200,
        };

        try {
          //error 404
          const response = await axios.request(config);
          console.log(response.data);
          res.status(200).send(result);
        } catch (error) {
          res.status(500).send(error.message);
        }
      } else {
        res.status(500).send(err);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while deleting the post.');
  }
};

//================ Post ======================//
exports.addRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.password === null || req.body.password === undefined || req.body.password === '') {
      return res.status(400).json({ errors: "Le mot de passe ne peut pas être vide" });
    }

    req.body.password = encryptPassword(req.body.password);
    const newUser = new requestModels(req.body);

    const savedUser = await newUser.save();
    try {
      const instance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      await instance.post(process.env.LINK_API + '/register', { UserId: savedUser._id });
      await sendMailVerifyEmail(req)
      res.status(201).send("Votre compte a bien ete cree. Veuillez maintenant vous connecter.");
    } catch (err) {
      const id = savedUser._id;
      console.log('Probleme avec l\'API')
      console.log(err.message)
      requestModels.findByIdAndRemove(id, async (err, docs) => {
        if (!err) {
          const result = {
            message: 'Probleme avec l\'API',
            status: 500,
          };
          res.status(500).send(result);
        } else {
          res.status(500).send(err);
        }
      });
    }
  } catch (err) {
    console.log('err', err);
    res.status(500).send(err);
  }
};

//================ Put ======================//
exports.updateRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.body.password) {
      req.body.password = encryptPassword(req.body.password);
    }

    if (req.body.password) {
      req.body.password = encryptPassword(req.body.password);
    }

    let token = req.headers["x-access-token"] ?? '';
    const id = await new Promise((res, rej) => {
      jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
          rej(err)
          res.status(500).send('Erreur')
        }
        res(decoded?.userid)
      });
    })
    if (id === null) {
      return res.status(400).send('Something is missing in the request');
    }

    const updatedUser = await requestModels.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    console.log(updatedUser);
    res.status(200).send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};