const router = require('express').Router();

const {
  obtenerTicketsPendientes,
  atenderTicket,
  finalizarTicket,
} = require('../controllers/tickets.controller');

router.get('/pendientes', obtenerTicketsPendientes);
router.put('/:id/atender', atenderTicket);
router.put('/:id/finalizar', finalizarTicket);

module.exports = router;