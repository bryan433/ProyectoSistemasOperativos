const router = require('express').Router();

const {
  crearPaciente,
  buscarPacientePorCedula,
  crearOBuscarPaciente,
} = require('../controllers/pacientes.controller');

router.post('/', crearPaciente);
router.post('/continuar', crearOBuscarPaciente);
router.get('/cedula/:cedula', buscarPacientePorCedula);

module.exports = router;