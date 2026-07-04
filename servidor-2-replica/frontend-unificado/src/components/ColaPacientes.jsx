import TicketCard from './TicketCard';

const ColaPacientes = ({ tickets, onAtender, onFinalizar }) => {
  if (!tickets.length) {
    return (
      <section className="text-center py-20 bg-white rounded-xl border border-dashed border-[#c2c6d4]">
        <p className="text-[#424752] font-medium">
          No hay pacientes en espera.
        </p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onAtender={onAtender}
          onFinalizar={onFinalizar}
        />
      ))}
    </section>
  );
};

export default ColaPacientes;