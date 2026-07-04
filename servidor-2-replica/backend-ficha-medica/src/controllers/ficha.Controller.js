const fichaService = require('../services/ficha.Service');

const obtenerTodasLasFichas = async (req, res) => {
    try {
        const fichas = await fichaService.obtenerTodasLasFichas();
        res.status(200).json(fichas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener fichas médicas', details: error.message });
    }
};

const obtenerFichaPorPaciente = async (req, res) => {
    const { pacienteId } = req.params;
    try {
        const ficha = await fichaService.obtenerFichaPorPaciente(pacienteId);
        if (!ficha) {
            return res.status(404).json({ error: 'Ficha médica no encontrada' });
        }
        res.status(200).json(ficha);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ficha médica', details: error.message });
    }
};

const crearConsulta = async (req, res) => {
    try {
        const nuevaConsulta = await fichaService.crearConsulta(req.body);
        res.status(201).json(nuevaConsulta);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear consulta médica', details: error.message });
    }
};

const obtenerConsultasPorPaciente = async (req, res) => {
    const { pacienteId } = req.params;
    try {
        const consultas = await fichaService.obtenerConsultasPorPaciente(pacienteId);
        res.status(200).json(consultas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener consultas', details: error.message });
    }
};

module.exports = {
    obtenerTodasLasFichas,
    obtenerFichaPorPaciente,
    crearConsulta,
    obtenerConsultasPorPaciente
};
