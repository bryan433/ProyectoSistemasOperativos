import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LaboratorioPage() {
  const [activeTab, setActiveTab] = useState('machines');
  
  // Machines State
  const [machines, setMachines] = useState([]);
  const [loadingMachines, setLoadingMachines] = useState(false);
  const [error, setError] = useState('');
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [exams, setExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [allExams, setAllExams] = useState([]); // Para el form de nueva orden
  const [newOrder, setNewOrder] = useState({ patientName: '', examId: '' });
  const [resultInputs, setResultInputs] = useState({});

  useEffect(() => {
    if (activeTab === 'machines') {
      fetchMachines();
    } else if (activeTab === 'orders') {
      fetchOrders();
      fetchAllExams();
    }
  }, [activeTab]);

  const fetchMachines = async () => {
    try {
      setLoadingMachines(true);
      const response = await axios.get('/api/laboratorio/machines');
      setMachines(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las máquinas del laboratorio.');
    } finally {
      setLoadingMachines(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await axios.get('/api/laboratorio/orders');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las órdenes de exámenes.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAllExams = async () => {
    // Para simplificar, buscamos los exámenes de todas las máquinas secuencialmente o usamos una lista.
    // Como no hicimos endpoint de todos los examenes, lo hacemos mapeando las máquinas si ya están,
    // o hacemos un truco: la API de órdenes tiene la info, pero para crear necesitamos todos los exámenes.
    // Vamos a cargar las máquinas y luego sus exámenes para el select.
    try {
      const mRes = await axios.get('/api/laboratorio/machines');
      let all = [];
      for (const m of mRes.data) {
        const eRes = await axios.get(`/api/laboratorio/exams/${m.id}`);
        all = [...all, ...eRes.data.map(e => ({...e, machineName: m.name}))];
      }
      setAllExams(all);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerExamenes = async (machine) => {
    try {
      if (selectedMachine?.id === machine.id) {
        setSelectedMachine(null);
        setExams([]);
        return;
      }
      setSelectedMachine(machine);
      setLoadingExams(true);
      const response = await axios.get(`/api/laboratorio/exams/${machine.id}`);
      setExams(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los exámenes.');
    } finally {
      setLoadingExams(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/laboratorio/orders', newOrder);
      setNewOrder({ patientName: '', examId: '' });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Error al crear orden');
    }
  };

  const handleCompleteOrder = async (orderId) => {
    const resultText = resultInputs[orderId];
    if (!resultText) return alert('Debes ingresar un resultado');
    try {
      await axios.put(`/api/laboratorio/orders/${orderId}`, { resultText });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Error al completar orden');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#003f87] to-[#0052a5] rounded-xl p-8 shadow-lg text-white flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Sistema de Laboratorio</h2>
          <p className="text-blue-100 text-lg opacity-90">Gestión de máquinas y órdenes de pacientes</p>
        </div>
        <div className="flex bg-white/10 p-1 rounded-lg mt-4 md:mt-0">
          <button 
            className={`px-6 py-2.5 rounded-md font-bold transition-all ${activeTab === 'machines' ? 'bg-white text-[#003f87] shadow-sm' : 'text-white hover:bg-white/20'}`}
            onClick={() => setActiveTab('machines')}
          >
            Catálogo Máquinas
          </button>
          <button 
            className={`px-6 py-2.5 rounded-md font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-[#003f87] shadow-sm' : 'text-white hover:bg-white/20'}`}
            onClick={() => setActiveTab('orders')}
          >
            Órdenes de Exámenes
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-sm border border-red-200">{error}</div>}

      {activeTab === 'machines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {loadingMachines ? (
            <div className="col-span-full text-center py-12 text-[#003f87] font-medium text-lg">Cargando máquinas...</div>
          ) : machines.map((machine) => (
            <div key={machine.id} className="bg-white rounded-xl shadow-md border border-[#e2e6f0] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#141d23]">{machine.name}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-[#003f87] text-xs font-bold uppercase rounded-full shadow-sm">
                    {machine.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-6 min-h-[60px]">{machine.description}</p>
                
                <button 
                  onClick={() => handleVerExamenes(machine)}
                  className={`w-full font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                    selectedMachine?.id === machine.id 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' 
                    : 'bg-[#003f87] hover:bg-[#002e66] text-white shadow-md'
                  }`}
                >
                  {selectedMachine?.id === machine.id ? 'Ocultar Exámenes' : 'Ir a Exámenes'}
                  <svg className={`w-5 h-5 transition-transform ${selectedMachine?.id === machine.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {selectedMachine?.id === machine.id && (
                <div className="bg-[#f8fafc] border-t border-[#e2e6f0] p-4 animate-fade-in">
                  {loadingExams ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="w-5 h-5 border-2 border-[#003f87] border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-sm text-gray-500">Cargando...</span>
                    </div>
                  ) : exams.length > 0 ? (
                    <ul className="space-y-3">
                      {exams.map(exam => (
                        <li key={exam.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                          <div className="font-semibold text-[#141d23] text-sm">{exam.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{exam.details}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-4 text-sm text-gray-500 italic">No hay exámenes registrados.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          {/* Formulario Nueva Orden */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e6f0] p-6">
            <h3 className="text-xl font-bold text-[#141d23] mb-4">Registrar Nueva Orden (Simulación Médico)</h3>
            <form onSubmit={handleCreateOrder} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Paciente</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#003f87] focus:border-transparent outline-none"
                  placeholder="Ej. Juan Pérez"
                  value={newOrder.patientName}
                  onChange={e => setNewOrder({...newOrder, patientName: e.target.value})}
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Examen Requerido</label>
                <select 
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#003f87] outline-none"
                  value={newOrder.examId}
                  onChange={e => setNewOrder({...newOrder, examId: e.target.value})}
                >
                  <option value="">Seleccione un examen...</option>
                  {allExams.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.machineName})</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 px-6 rounded-lg transition-colors whitespace-nowrap shadow-md">
                Crear Orden
              </button>
            </form>
          </div>

          {/* Lista de Órdenes */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e6f0] overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-[#141d23]">Cola de Trabajo (Laboratorista)</h3>
            </div>
            <div className="p-0">
              {loadingOrders ? (
                <div className="text-center py-12 text-[#003f87]">Cargando órdenes...</div>
              ) : orders.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-gray-900">{order.patientName}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'Pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-600 font-medium">Examen: <span className="text-blue-700">{order.examName}</span></p>
                        <p className="text-gray-500 text-sm">Máquina: {order.machineName}</p>
                      </div>

                      <div className="w-full lg:w-1/2">
                        {order.status === 'Pendiente' ? (
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Ingresar resultado del examen..."
                              className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#003f87] outline-none"
                              value={resultInputs[order.id] || ''}
                              onChange={e => setResultInputs({...resultInputs, [order.id]: e.target.value})}
                            />
                            <button 
                              onClick={() => handleCompleteOrder(order.id)}
                              className="bg-[#003f87] hover:bg-[#002e66] text-white font-bold py-2 px-4 rounded-lg shadow-sm"
                            >
                              Guardar
                            </button>
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                            <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Resultado Registrado:</span>
                            <span className="text-gray-800">{order.result}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No hay órdenes registradas.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
