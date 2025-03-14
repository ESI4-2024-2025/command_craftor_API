/*
Fonction:
CA Get All/Ajouter/CA Supprimer/CA Archiver/Envoyer Mail Quand Création a nous et user/Mail Quand fermeture du ticket

Check si admin = CA 
*/
const ObjectID = require('mongoose').Types.ObjectId
const logger = require('../logger');
const Statut = require('../models/Enum/statut');
const Ticket = require('../models/ticketModel');
const addTicketMail = require('../template/mail/addTicketMail');
const endTicketMail = require('../template/mail/endTicketMail');
const sendMail = require('../mailer/mailer');

/**
 * Get all tickets.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Add a new ticket.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.addTicket = async (req, res) => {
    const ticket = new Ticket(req.body);
    try {
        const newTicket = await ticket.save();
        await this.sendCreationEmail(req);
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/**
 * Delete a ticket.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

exports.deleteTicket = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ticket ID' });
        }
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        await ticket.remove();
        res.status(200).json({ message: 'Ticket deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Archive a ticket.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.archiveTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        ticket.archive = true;

        await ticket.save();
        res.status(200).json({ message: 'Ticket archived' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Update the status of a ticket.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.updateTicketStatus = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        switch (req.body.statut) {
            case 'En Attente':
            ticket.statut = "EN_ATTENTE";
            break;
            case 'En Cours':
            ticket.statut = "EN_COURS";
            break;
            case 'Fini':
            ticket.statut = "FINI";
            break;
        }
        if(req.body.statut === Statut.FINI)
        {
            logger.info('Ticket closed');
            await this.sendClosureEmail(req, ticket);
            logger.info('Email sent successfully');
        }
        await ticket.save();
        res.status(200).json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Send email when a ticket is created.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.sendCreationEmail = async (req) => {
    try {
        const emailVerifyString = String(addTicketMail); // Conversion en chaîne
        if (typeof emailVerifyString !== "string") {
            console.error("Erreur : addTicketMail n'est pas une chaîne !");
        }
        await sendMail(req.body.email, 'Command Craftor - Ticket Créé', emailVerifyString);
    } catch (err) {
        logger.error('Error while sending email:', err);
        return err.status;
    }
};

/**
 * Send email when a ticket is closed.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.sendClosureEmail = async (req, ticket) => {
    try {
        let updatedVerifyEmail;
        const emailVerifyString = String(endTicketMail); // Conversion en chaîne
        const numero = ticket._id;
        const objet = ticket.titre;
        if (typeof emailVerifyString !== "string") {
            console.error("Erreur : emailVerify n'est pas une chaîne !");
        }

        updatedVerifyEmail = emailVerifyString
            .replace(/{{Numéro_du_ticket}}/g, numero)
            .replace(/{{Objet_du_ticket}}/g, objet);

        await sendMail(ticket.email, 'Command Craftor - Fermeture de votre ticket n°' + ticket._id, updatedVerifyEmail);
    } catch (err) {
        logger.error('Error while sending email:', err);
        return err.status;
    }
};
