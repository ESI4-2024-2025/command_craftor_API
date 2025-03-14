const Ticket = require('../controllers/ticketControllers');

module.exports = function (app) {

// Define your routes
app.get('/tickets', Ticket.getAllTickets);  // Fonctionne
app.post('/tickets', Ticket.addTicket);     // Fonctionne
app.delete('/tickets/:id', Ticket.deleteTicket);    // Fonctionne
app.put('/tickets/:id/archive', Ticket.archiveTicket);  // Fonctionne
app.put('/tickets/:id/statut', Ticket.updateTicketStatus);  // Fonctionne
app.post('/tickets/:id/sendClosureEmail', Ticket.sendClosureEmail);
}
