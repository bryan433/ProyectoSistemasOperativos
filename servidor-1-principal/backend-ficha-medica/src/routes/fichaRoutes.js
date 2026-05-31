const express = require('express');
const router = express.Router();
const fichaController = require('../controllers/fichaController');

// Obtener todas las fichas
router.get('/', fichaController.obtenerTodasLasFichas);

// Obtener ficha por ID de paciente
router.get('/paciente/:pacienteId', fichaController.obtenerFichaPorPaciente);

// Crear una nueva consulta médica
router.post('/consulta', fichaController.crearConsulta);

// Obtener consultas de un paciente
router.get('/paciente/:pacienteId/consultas', fichaController.obtenerConsultasPorPaciente);

module.exports = router;
