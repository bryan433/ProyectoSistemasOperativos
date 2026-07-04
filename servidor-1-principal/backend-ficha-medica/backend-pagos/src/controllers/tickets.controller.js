const prisma = require('../config/prisma');

const obtenerTicketsPendientes = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        estado: 'esperando',
      },
      include: {
        paciente: true,
      },
      orderBy: {
        numero_turno: 'asc',
      },
    });

    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const atenderTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.update({
      where: {
        id: Number(id),
      },
      data: {
        estado: 'en_consulta',
      },
      include: {
        paciente: true,
      },
    });

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const finalizarTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.update({
      where: {
        id: Number(id),
      },
      data: {
        estado: 'finalizado',
      },
      include: {
        paciente: true,
      },
    });

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerTicketsPendientes,
  atenderTicket,
  finalizarTicket,
};