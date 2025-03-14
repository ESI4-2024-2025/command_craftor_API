const mongoose = require('mongoose')
const { Statut } = require('../models/Enum/statut')

const { Schema } = mongoose

const ticketSchema = Schema({
    titre: { type: String, required: true },
    corps: { type: String, required: true },
    email: { type: String, required: true },
    statut: { type: String, enum: Statut ? Object.values(Statut) : [], required: false, default: Statut?.EN_ATTENTE || 'EN_ATTENTE' },
    archived: { type: Boolean, required: false, default: false },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Ticket', ticketSchema, 'Ticket')


/*

Model ticket: 
TItre/Corps/Adresse mail/Statut/Archiver
Fonction:
CA Get All/Ajouter/CA Supprimer/CA Archiver/Envoyer Mail Quand Création a nous et user/Mail Quand fermeture du ticket

Check si admin = CA 

*/
