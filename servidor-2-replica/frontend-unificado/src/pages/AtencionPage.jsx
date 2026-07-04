import { useState } from 'react';
import PacienteForm from '../components/PacienteForm';
import PagoForm from '../components/PagoForm';

const AtencionPage = () => {
  const [pacienteActual, setPacienteActual] = useState(null);
  const [ticketGenerado, setTicketGenerado] = useState(null);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Módulo de Atención y Pagos
        </h1>
        <p className="text-gray-500 mt-1">
          Registro de pacientes, pagos y generación automática de ticket.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PacienteForm onPacienteCreado={setPacienteActual} />
        <PagoForm pacienteActual={pacienteActual} onPagoExitoso={setTicketGenerado} />
      </div>

      {ticketGenerado && (
        <section className="max-w-md mx-auto bg-white border-2 border-blue-100 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-blue-600 p-4 text-center text-white">
            <h3 className="text-lg font-bold">TICKET DE ATENCIÓN</h3>
          </div>

          <div className="p-8 text-center space-y-4">
            <div className="text-6xl font-black text-blue-900">
              A-{String(ticketGenerado.numero_turno).padStart(3, '0')}
            </div>

            <div className="border-t border-gray-100 pt-4 text-left space-y-2">
              <p><strong>Paciente:</strong> {ticketGenerado.paciente.nombre} {ticketGenerado.paciente.apellido}</p>
              <p><strong>RUT:</strong> {ticketGenerado.paciente.cedula}</p>
              <p><strong>Estado:</strong> {ticketGenerado.estado}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AtencionPage;