import axios from 'axios';

const PAGOS_API_URL = 'http://localhost:3001/api';
const MEDICO_API_URL = 'http://localhost:3002/api';

export const api = {
  
  registrarPaciente: (data) => axios.post(`${PAGOS_API_URL}/pacientes`, data),

  crearOBuscarPaciente: (data) =>
    axios.post(`${PAGOS_API_URL}/pacientes/continuar`, data),

  registrarPago: (data) => axios.post(`${PAGOS_API_URL}/pagos`, data),

  getTicketsPendientes: () => axios.get(`${PAGOS_API_URL}/tickets/pendientes`),
  atenderTicket: (id) => axios.put(`${PAGOS_API_URL}/tickets/${id}/atender`),
  finalizarTicket: (id) => axios.put(`${PAGOS_API_URL}/tickets/${id}/finalizar`),

  crearConsulta: (data) => axios.post(`${MEDICO_API_URL}/fichas/consulta`, data),
};

