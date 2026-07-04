const router = require('express').Router();

const {
  registrarPago,
} = require('../controllers/pagos.controller');

router.post('/', registrarPago);

module.exports = router;