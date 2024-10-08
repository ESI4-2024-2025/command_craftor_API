const ObjectID = require('mongoose').Types.ObjectId
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const { body, validationResult, check } = require('express-validator');
const userModels = require('../models/userModel')
const accessTokenSecret = process.env.TOKEN_SECRET
const axios = require('axios');
const { authJwt } = require('../middlewares')
const { SHA256 } = require('crypto-js');
const https = require("https");
const fs = require('fs');
const e = require('cors');

//================ Upload ======================//
async function convertImageToBase64(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        reject(error);
      } else {
        const base64Image = Buffer.from(data).toString('base64');
        resolve(base64Image);
      }
    });
  });
}

//================ Encryptage ======================//
function encryptPassword(password) {
  try {
    const encryptedPassword = SHA256(password + process.env.SHA_KEY).toString();
    return encryptedPassword;
  } catch (err) {
    console.error(err);
    throw new Error('An error occurred while encrypting the password.');
  }
}

//================ Contenue Transporteur ======================//
let transporter = nodemailer.createTransport({
  host: 'smtp.orange.fr',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD_MAIL,
  },
})

//================ Login || Post ======================//
exports.login = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const email = req.body.email;
    const password = encryptPassword(req.body.password);

    userModels.findOne({ email, password }, (err, docs) => {
      if (!err) {
        if (docs !== null) {
          const accessToken = jwt.sign(
            { email: docs.email, userid: docs._id, username: docs.username },
            accessTokenSecret,
            { algorithm: 'HS256', expiresIn: '24h' }
          );
          /* #swagger.responses[200] = {
                  description: 'Connexion réussie, le token accès est retourné.',
                  schema: {
                      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlsaGFuZnJrQGdtYWlsLmNvbWEiLCJpYXQiOjE2ODMwNTYxMjgsImV4cCI6MTY4MzA1NzMyOH0.jN0alvkZR_8JE6hxdBFPLdHNuFOrPkTXPc06B_7clCI',
                  }
          } */
          res.status(200).send({ accessToken });
        } else {
          res.status(400).send('Votre email ou mot de passe est incorrect');
        }
      } else {
        console.log(
          'Error while finding the data' + JSON.stringify(err, undefined, 2)
        );
        res.status(500).send(err);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.logout = (req, res) => {

  // La déconnexion est gérée par le frontend : oubli du token.

  res.send('Logout successful')
}

//================ Get ======================//
exports.getCurrentProfile = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send('Access token is missing');
    }

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid access token');
      }

      const email = decoded.email;
      userModels.findOne({ email: email }, (err, docs) => {
        if (err) {
          res.status(500).send('An error occurred while retrieving the current profile.');
          console.log('Error while finding the data' + JSON.stringify(err, undefined, 2));
        } else if (!docs) {
          res.status(404).send('User not found.');
          console.log('User not found for email: ' + email);
        } else {
          docs.password = undefined;
          res.status(200).send(docs);
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving the current profile.');
  }
};

// GET général
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModels.find();
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving all users.');
  }
};

exports.emailValidationUpdate = (req, res) => {
  try {
    console.log(req.params.token);

    userModels.find({ token: req.params.token }, (err, Info) => {
      if (!err) {
        if (Info.length > 0) {
          const id = Info[0]._id.toString().split('/').pop();

          // Vérification si email_verified est déjà true
          if (Info[0].email_verified) {
            console.log('Email is already verified. Redirecting...');
            res.redirect(process.env.PAGE_REDIRECTION + '/profile'); // Redirige sans rien faire d'autre
          } else {
            // Mettre à jour email_verified
            userModels.findByIdAndUpdate(id, { $set: { email_verified: true } }, { new: false }, (err, docs) => {
              if (!err) {
                console.log('Email verification updated:', docs);
                res.redirect(process.env.PAGE_REDIRECTION + '/profile');
              } else {
                console.log('Error while updating the data', JSON.stringify(err, undefined, 2));
                res.status(500).send('An error occurred while updating email validation.');
              }
            });
          }
        } else {
          console.log('No user found with the provided token.');
          res.status(404).send('User not found.');
        }
      } else {
        console.log('Error while finding the data', JSON.stringify(err, undefined, 2));
        res.status(500).send('An error occurred while updating email validation.');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while updating email validation.');
  }
};


//================ Delete ======================//
exports.deleteUser = (req, res) => {
  try {
    const id = req.body._id;

    if (!ObjectID.isValid(id)) {
      return res.status(400).send(`No record with given id: ${id}`);
    }

    userModels.findByIdAndDelete(id, async (err, docs) => {
      if (!err) {
        const result = {
          data: docs,
          message: 'Post has been removed successfully.',
          status: 200,
        };
        res.status(200).send(result);
      } else {
        res.status(500).send(err);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while deleting the post.');
  }
};

exports.deleteFavorite = async (req, res) => {
  try {
    const id = req.body._id;
    const favorite = req.body.favorite;

    if (!ObjectID.isValid(id)) {
      return res.status(400).send(`No record with given id: ${id}`);
    }

    const favoriteId = ObjectID(favorite);
    userModels.findByIdAndUpdate(id, { $pull: { favoris: favoriteId } }, { new: true }, (err, docs) => {
      if (!err) {
        res.status(200).send(docs);
      } else {
        console.log('Error while updating the data', JSON.stringify(err, undefined, 2));
        res.status(500).send('An error occurred while adding the favorite.');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while adding the favorite.');
  }
};

//================ Post ======================//
exports.register = async (req, res) => {
  try {
    if (req.body.password === null || req.body.password === undefined || req.body.password === '') {
      return res.status(400).json({ errors: "Le mot de passe ne peut pas être vide" });
    }
    req.body.password = encryptPassword(req.body.password);
    const newUser = new userModels(req.body);
    await newUser.save(); // Ajoutez cet appel pour sauvegarder le nouvel utilisateur dans la base de données
    res.status(201).json(newUser); // Répond avec le nouvel utilisateur créé
  } catch (err) {
    console.log('err', err);
    res.status(500).send(err);
  }
};

exports.emailPasswordReset = (req, res) => {
  async function main() {
    try {
      userModels.find({ email: req.body.email }, async (err, docs) => {
        if (!err && docs.length > 0) {
          console.log("Email Found : " + req.body.email);
          // console.log(docs[0])
          req.userId = docs[0]._id
          const ress = await sendMailPasswordReset(req);
          if (ress === undefined) {
            res.status(200).send("Email 'Reset de Mots de Passe' Envoyer");
          }
          else {
            res.status(500).send('An error occurred while sending email.');
          }
        } else {
          console.log('Error while finding the data' + JSON.stringify(err, undefined, 2));
          res.status(500).send(err);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  }

  main().catch(console.error);
};

//================ Put ======================//
exports.addFavorite = async (req, res) => {
  try {
    const id = req.body._id;
    const favorite = req.body.favorite;

    if (!ObjectID.isValid(id)) {
      return res.status(400).send(`No record with given id: ${id}`);
    }

    const favoriteId = ObjectID(favorite);
    userModels.findByIdAndUpdate(id, { $push: { favoris: favoriteId } }, { new: true }, (err, docs) => {
      if (!err) {
        res.status(200).send(docs);
      } else {
        console.log('Error while updating the data', JSON.stringify(err, undefined, 2));
        res.status(500).send('An error occurred while adding the favorite.');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while adding the favorite.');
  }
};

exports.emailVerify = async (req, res) => {
  try {
    userModels.find({ email: req.body.email }, (err, docs) => {
      if (!err) {
        console.log("Email Found : " + req.body.email);
      } else {
        console.log('Error while finding the data' + JSON.stringify(err, undefined, 2));
      }
    });

    const ress = await sendMailVerifyEmail(req);
    if (ress === undefined) {
      res.status(200).send("Email 'Verification de Mail' Envoyer");
    }
    else {
      res.status(500).send('An error occurred while sending email.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.passwordModify = async (req, res) => {
  try {
    const id = req.body.userId;
    const newPassword = req.body.password; // Le nouveau mot de passe en texte brut

    // Mettre à jour le mot de passe dans la base de données
    await userModels.findByIdAndUpdate(id, { password: encryptPassword(newPassword) });

    // Récupérer l'e-mail associé à cet utilisateur
    const user = await userModels.findById(id);
    // console.log(user)

    const userEmail = user.email;

    // Envoyer le courriel de confirmation avec le nouvel e-mail
    const ress = await sendMailpasswordModify(userEmail);
    if (ress === undefined) {
      res.status(200).send("Email 'Modification de Mots de Passe' Envoyé");
    }
    else {
      res.status(500).send('An error occurred while sending email.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.profileUpdate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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

    const updatedUser = await userModels.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    console.log(updatedUser);
    res.status(200).send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

//================ Contenu des Mails ======================//
async function sendMailPasswordReset(req) {
  try {
    await transporter.sendMail({
      from: `"Command Craftor" <${process.env.EMAIL}>`, // Adresse e-mail de l'expéditeur
      to: req.body.email, // Adresse e-mail du destinataire
      subject: 'Réinitialisation de votre mot de passe - Command Craftor', // Sujet de l'e-mail
      html:
        `<h2>Réinitialisation de votre mot de passe</h2>
    <p>Suite à votre demande de réinitialisation de mot de passe, veuillez suivre les instructions ci-dessous.</p>
    <p>Appuyez sur le bouton ci-dessous pour changer votre mot de passe :</p>
    <a href="${process.env.LINK_FRONT + '/modify-password/' + req.userId}">
      <button class="reset_password_button" style="width: 150px; padding: 10px; margin-left: 10px; font-size: 12px; text-transform: uppercase; position: relative; border-radius: 90px; border: 2px solid #F85242; background: #F85242; color: #FFFFFF; cursor: pointer; font-family: 'Insomnia', sans-serif; overflow: hidden; z-index: 1;">Changer de mot de passe
        <span style="background: #F85242; height: 100%; width: 0; border-radius: 25px; position: absolute; left: 0; bottom: 0; z-index: -1; transition: width 0.5s;"></span>
      </button>
    </a>
    <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce mail.</p>` // Contenu HTML de l'e-mail
    });

    console.log('Email sent successfully');
  } catch (err) {
    console.error('Error while sending email:', err);
  }
}

async function sendMailVerifyEmail(req) {
  try {
    // const imagePath = './img/logo.png';
    // const bs64 = await convertImageToBase64(imagePath);
    // console.log(bs64)

    const url = process.env.LINK_FRONT + '/users/email/validationupdate/:email=' + req.body.email;
    await transporter.sendMail({
      from: `"Command Craftor" <${process.env.EMAIL}>`,
      to: req.body.email,
      subject: 'Command Craftor - Verifier votre Mail',
      html:
        `<h2>Verification de Mail</h2>
         <p>Appuyez sur le bouton pour pouvoir Valider Votre Mail</p>
         <a href=${url}>
           <button class="nav_button" style="width: 150px; padding: 10px; margin-left: 10px; font-size: 12px; text-transform: uppercase; position: relative; border-radius: 90px; border: 2px solid #F85242; background: #F85242; color: #FFFFFF; cursor: pointer; font-family: 'Insominia', sans-serif; overflow: hidden; z-index: 1;">Verifier Mon Mail
             <span style="background: #F85242; height: 100%; width: 0; border-radius: 25px; position: absolute; left: 0; bottom: 0; z-index: -1; transition: width 0.5s;"></span>
           </button>
         </a>
         <p>
         <br><br>
         Cordialement,
         <br>Si vous n'avez pas demandé à recevoir cet e-mail, vous pouvez l'ignorer.</p>` // Contenu HTML de l'e-mail
    });
    //  <img src="data:image/png;base64,${bs64}" alt="Signature" style="display: block; margin-top: 20px;">,
    //En attente de recevoir un lien
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Error while sending email:', err);
    return res.status
  }
}

async function sendMailpasswordModify(userEmail) {
  try {
    await transporter.sendMail({
      secure: false, // true for 465, false for other ports
      from: `"Command Craftor" <${process.env.EMAIL}>`, // Adresse e-mail de l'expéditeur
      to: userEmail, // Adresse e-mail du destinataire
      subject: 'Command Craftor - Changement de Mots de Passe', // Sujet de l'e-mail
      html:
        '<h2>Modification de Mots de passe</h2><p>Votre mot de passe a été modifié.</p>', // Contenu HTML de l'e-mail
    });

    console.log('Email sent successfully');
  } catch (err) {
    console.error('Error while sending email:', err);
  }
}

