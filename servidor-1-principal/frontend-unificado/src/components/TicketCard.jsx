const TicketCard = ({ ticket, onAtender, onFinalizar }) => {
  const turno = `A-${String(ticket.numero_turno).padStart(3, '0')}`;
  const paciente = ticket.paciente;

  const estaEsperando = ticket.estado === 'esperando';
  const estaEnConsulta = ticket.estado === 'en_consulta';

  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <header className="flex items-center justify-between p-4 bg-blue-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <strong className="text-xl text-blue-800">{turno}</strong>
          <span className="rounded-full px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700">
            {ticket.estado}
          </span>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div>
          <p className="font-bold text-gray-900">
            {paciente?.nombre} {paciente?.apellido}
          </p>
          <p className="text-sm text-gray-500">
            RUT: {paciente?.cedula}
          </p>
        </div>

        {estaEsperando && (
          <button onClick={() => onAtender(ticket.id)} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">
            Atender
          </button>
        )}

        {estaEnConsulta && (
          <button onClick={() => onFinalizar(ticket.id)} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold">
            Finalizar atención
          </button>
        )}
      </div>
    </article>
  );
};

export default TicketCard;