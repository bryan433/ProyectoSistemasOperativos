import { useState } from 'react';
import { api } from '../services/api';

const PagoForm = ({ pacienteActual, onPagoExitoso }) => {
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('Consulta Médica General');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pacienteActual) {
      setMensaje('Primero debes continuar con un paciente.');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const response = await api.registrarPago({
        paciente_id: pacienteActual.id,
        monto: Number(monto),
        concepto,
      });

      onPagoExitoso(response.data.ticket);
      setMonto('');
      setMensaje('Pago registrado y ticket generado correctamente.');
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al procesar pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl border border-[#c2c6d4] shadow-sm">
      <h3 className="text-xl font-bold mb-6">Registro de Pago</h3>

      {!pacienteActual ? (
        <div className="mb-4 bg-[#f6faff] border border-[#c2c6d4] rounded-lg p-4 text-sm text-[#424752]">
          Primero registra o verifica un paciente para habilitar el pago.
        </div>
      ) : (
        <div className="mb-4 bg-[#ecf5fe] border border-[#c2c6d4] rounded-lg p-4 text-sm">
          <p className="font-bold text-[#003f87] mb-2">Paciente seleccionado</p>
          <p>
            <strong>Nombre:</strong> {pacienteActual.nombre}{' '}
            {pacienteActual.apellido}
          </p>
          <p>
            <strong>RUT:</strong> {pacienteActual.cedula}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-xs font-bold text-[#424752] uppercase mb-1">
            Concepto
          </span>

          <select
            value={concepto}
            onChange={(event) => setConcepto(event.target.value)}
            disabled={!pacienteActual}
            className="w-full px-4 py-2 bg-[#f6faff] border border-[#c2c6d4] rounded-lg disabled:opacity-50"
          >
            <option>Consulta Médica General</option>
            <option>Especialidad Cardiología</option>
            <option>Urgencia</option>
          </select>
        </label>

        <label className="block">
          <span className="block text-xs font-bold text-[#424752] uppercase mb-1">
            Monto
          </span>

          <input
            type="number"
            value={monto}
            onChange={(event) => setMonto(event.target.value)}
            required
            disabled={!pacienteActual}
            className="w-full px-4 py-2 bg-[#f6faff] border border-[#c2c6d4] rounded-lg text-[#003f87] font-bold disabled:opacity-50"
          />
        </label>

        <button
          disabled={loading || !pacienteActual}
          className="w-full bg-[#198754] text-white py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Procesar pago y generar ticket'}
        </button>

        {mensaje && (
          <p className="text-sm text-center text-[#003f87]">{mensaje}</p>
        )}
      </form>
    </section>
  );
};

export default PagoForm;