import { useState } from 'react';
import { api } from '../services/api';

const PacienteForm = ({ onPacienteCreado }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    correo: '',
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (campo, valor) => {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const response = await api.crearOBuscarPaciente(form);

      onPacienteCreado(response.data);

      setMensaje(
        `Paciente listo para pago: ${response.data.nombre} ${response.data.apellido}`,
      );
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al verificar paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl border border-[#c2c6d4] shadow-sm">
      <h3 className="text-xl font-bold mb-6">Registro de Paciente</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" value={form.nombre} onChange={(v) => handleChange('nombre', v)} required />
        <Input label="Apellido" value={form.apellido} onChange={(v) => handleChange('apellido', v)} required />
        <Input label="Cédula / RUT" value={form.cedula} onChange={(v) => handleChange('cedula', v)} required />
        <Input label="Teléfono" value={form.telefono} onChange={(v) => handleChange('telefono', v)} />
        <Input label="Correo" value={form.correo} onChange={(v) => handleChange('correo', v)} type="email" />

        <button
          disabled={loading}
          className="w-full bg-[#0056b3] text-white py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Continuar con pago'}
        </button>

        {mensaje && <p className="text-sm text-center text-[#003f87]">{mensaje}</p>}
      </form>
    </section>
  );
};

const Input = ({ label, value, onChange, type = 'text', required = false }) => (
  <label className="block">
    <span className="block text-xs font-bold text-[#424752] uppercase mb-1">
      {label}
    </span>

    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      className="w-full px-4 py-2 bg-[#f6faff] border border-[#c2c6d4] rounded-lg outline-none focus:border-[#0056b3]"
    />
  </label>
);

export default PacienteForm;