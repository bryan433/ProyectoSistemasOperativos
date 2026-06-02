const prisma = require('../config/prisma');

const crearPaciente = async (req, res) => {
  try {
    const paciente = await prisma.paciente.create({
      data: req.body,
    });

    return res.status(201).json(paciente);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Ya existe un paciente con ese RUT/Cédula',
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};

const buscarPacientePorCedula = async (req, res) => {
  try {
    const { cedula } = req.params;

    const paciente = await prisma.paciente.findUnique({
      where: {
        cedula,
      },
    });

    if (!paciente) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
      });
    }

    return res.json(paciente);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const crearOBuscarPaciente = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      cedula,
      telefono,
      correo,
    } = req.body;

    const paciente = await prisma.paciente.upsert({
      where: {
        cedula,
      },
      update: {
        nombre,
        apellido,
        telefono,
        correo,
      },
      create: {
        nombre,
        apellido,
        cedula,
        telefono,
        correo,
      },
    });

    return res.status(200).json(paciente);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  crearPaciente,
  buscarPacientePorCedula,
  crearOBuscarPaciente,
};