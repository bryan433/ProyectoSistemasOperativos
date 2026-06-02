import { requestJson } from './api'

const pagosApiBase =
  import.meta.env.VITE_PAGOS_API_URL ?? '/api'

export const registrarPago = async (datos) => {
  return requestJson(`${pagosApiBase}/pagos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
}

export const generarTicket = async (datos) => {
  return requestJson(`${pagosApiBase}/tickets/llamar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
}