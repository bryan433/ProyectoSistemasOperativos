import { useEffect, useState } from 'react';
import ColaPacientes from '../components/ColaPacientes';
import ConsultaForm from '../components/ConsultaForm';
import { api } from '../services/api';
import { subscribeToTickets } from '../services/socket';

const MedicoPage = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketEnConsulta, setTicketEnConsulta] = useState(null);
  const [alerta, setAlerta] = useState('');

  const cargarTickets = async () => {
    const response = await api.getTicketsPendientes();
    setTickets(response.data);
  };

  useEffect(() => {
    let activo = true;

    api.getTicketsPendientes()
      .then((response) => {
        if (activo) {
          setTickets(response.data);
        }
      })
      .catch((error) => {
        console.error('Error al cargar tickets pendientes:', error);
      });

    const unsubscribe = subscribeToTickets((nuevoTicket) => {
      setTickets((actuales) => {
        const existe = actuales.some((ticket) => ticket.id === nuevoTicket.id);

        if (existe) {
          return actuales;
        }

        return [...actuales, nuevoTicket];
      });

      setAlerta(
        `Nuevo ticket A-${String(nuevoTicket.numero_turno).padStart(3, '0')}`,
      );

      setTimeout(() => setAlerta(''), 4000);
    });

    return () => {
      activo = false;
      unsubscribe();
    };
  }, []);

  const handleAtender = async (id) => {
    const response = await api.atenderTicket(id);

    setTicketEnConsulta(response.data);

    setTickets((actuales) =>
      actuales.filter((ticket) => ticket.id !== id),
    );
  };

  const handleGuardarConsulta = async (datosConsulta) => {
    if (!ticketEnConsulta) {
      return;
    }

    await api.crearConsulta(datosConsulta);
    await api.finalizarTicket(ticketEnConsulta.id);

    setTicketEnConsulta(null);
    await cargarTickets();

    setAlerta('Consulta guardada y ticket finalizado');
    setTimeout(() => setAlerta(''), 4000);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#141d23]">Módulo Médico</h2>
          <p className="text-[#424752] mt-1">
            Cola de atención, ficha médica y consulta clínica.
          </p>
        </div>

        <span className="bg-[#d3e2ed] text-[#003f87] px-4 py-2 rounded-full font-bold">
          {tickets.length} en espera
        </span>
      </header>

      {alerta && (
        <div className="bg-[#0056b3] text-white px-6 py-4 rounded-xl shadow">
          {alerta}
        </div>
      )}

      {ticketEnConsulta && (
        <ConsultaForm
          ticket={ticketEnConsulta}
          onGuardar={handleGuardarConsulta}
          onCancelar={() => setTicketEnConsulta(null)}
        />
      )}

      <ColaPacientes
        tickets={tickets}
        onAtender={handleAtender}
        onFinalizar={() => {}}
      />
    </div>
  );
};

export default MedicoPage;