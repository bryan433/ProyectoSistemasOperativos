const prisma = require('../config/prisma');
const { getSocket } = require('../config/socket');

const registrarPago = async (req, res) => {
  try {
    const { paciente_id, monto, concepto } = req.body;

    const ultimoTicket = await prisma.ticket.findFirst({
      orderBy: { numero_turno: 'desc' },
    });

    const numeroTurno = ultimoTicket ? ultimoTicket.numero_turno + 1 : 1;

    const resultado = await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.create({
        data: {
          paciente_id,
          numero_turno: numeroTurno,
          estado: 'esperando',
        },
        include: {
          paciente: true,
        },
      });

      const pago = await tx.pago.create({
            data: {
                paciente_id,
                ticket_id: ticket.id,
                monto,
                concepto,
                estado: 'pagado',
        },
        });

      return { pago, ticket };
    });
    
    const io = getSocket();

    io.emit('ticket_generado', resultado.ticket);

    res.status(201).json(resultado);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  registrarPago,
};