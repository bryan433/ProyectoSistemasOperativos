import { useEffect, useState } from 'react';
import ColaPacientes from '../components/ColaPacientes';
import ConsultaForm from '../components/ConsultaForm';
import { api } from '../services/api';
import { subscribeToTickets } from '../services/socket';

const MedicoPage = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketEnConsulta, setTicketEnConsulta] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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

    // Cierra el módulo de síntomas y limpia el ticket actual
    setTicketEnConsulta(null);
    await cargarTickets();

    // Muestra el Pop Up de éxito
    setShowPopup(true);
  };

  return (
    <div className="space-y-8">
      {/* Pop Up de Éxito */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-[#141d23] mb-2">¡Atendido!</h3>
            <p className="text-[#424752] mb-6">El paciente ha sido atendido con éxito y la consulta finalizó.</p>
            <button 
              onClick={() => setShowPopup(false)}
              className="bg-[#0056b3] hover:bg-[#003f87] text-white px-6 py-2 rounded-lg font-bold w-full transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

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