const router = require('express').Router();

const {
  obtenerTodasLasFichas,
  obtenerFichaPorPaciente,
  crearConsulta,
  obtenerConsultasPorPaciente,
} = require('../controllers/ficha.Controller');

router.get('/', obtenerTodasLasFichas);
router.get('/paciente/:pacienteId', obtenerFichaPorPaciente);
router.get('/consultas/paciente/:pacienteId', obtenerConsultasPorPaciente);
router.post('/consulta', crearConsulta);

module.exports = router;