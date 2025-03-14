const nodemailer = require("nodemailer");
const logger = require('../logger');

//================ Contenue Transporteur ======================//

let transporter;
try {
transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD_MAIL,
    },
});
console.log('Transporter created successfully');
logger.info('Transporter created successfully');
} catch (error) {
console.error('Error creating transporter:', error);
logger.error('Error creating transporter:', error);
}

const sendMail = async (to, subject, html) => {
    const mailOptions = {
    from: `"Command Craftor" <${process.env.EMAIL}>`, // sender address
    to,
    subject,
    html,
    };

    try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé:', info.response);
    logger.info('Email sent successfully');
    } catch (error) {
    // console.error('Erreur d’envoi:', error);
    logger.error('Error while sending email:', err);
    }
};

module.exports = sendMail;