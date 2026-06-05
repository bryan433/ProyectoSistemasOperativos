import { useState } from 'react';

const ConsultaForm = ({ ticket, onGuardar, onCancelar }) => {
  const [form, setForm] = useState({
    motivo_consulta: '',
    sintomas: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  });

  const handleChange = (campo, valor) => {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onGuardar({
      paciente_id: ticket.paciente_id,
      medico_id: 1,
      ...form,
    });
  };

  return (
    <section className="bg-white border border-[#c2c6d4] rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-2">Ficha médica / Consulta</h3>

      <p className="text-sm text-[#424752] mb-6">
        Paciente: <strong>{ticket.paciente.nombre} {ticket.paciente.apellido}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea label="Motivo de consulta" value={form.motivo_consulta} onChange={(v) => handleChange('motivo_consulta', v)} required />
        <Textarea label="Síntomas" value={form.sintomas} onChange={(v) => handleChange('sintomas', v)} />
        <Textarea label="Diagnóstico" value={form.diagnostico} onChange={(v) => handleChange('diagnostico', v)} required />
        <Textarea label="Tratamiento" value={form.tratamiento} onChange={(v) => handleChange('tratamiento', v)} />
        <Textarea label="Observaciones" value={form.observaciones} onChange={(v) => handleChange('observaciones', v)} />

        <div className="flex gap-3">
          <button className="bg-[#0056b3] text-white px-5 py-2 rounded-lg font-bold">
            Guardar consulta y finalizar
          </button>

          <button type="button" onClick={onCancelar} className="border border-[#0056b3] text-[#0056b3] px-5 py-2 rounded-lg font-bold">
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
};

const Textarea = ({ label, value, onChange, required = false }) => (
  <label className="block">
    <span className="block text-xs font-bold text-[#424752] uppercase mb-1">
      {label}
    </span>

    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      rows="3"
      className="w-full px-4 py-2 bg-[#f6faff] border border-[#c2c6d4] rounded-lg outline-none focus:border-[#0056b3]"
    />
  </label>
);

export default ConsultaForm;