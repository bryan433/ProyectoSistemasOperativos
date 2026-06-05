import { requestJson } from './api'

const medicoApiBase =
  import.meta.env.VITE_MEDICO_API_URL ??
  '/api/fichas'

export const obtenerFichas = async () => {
  return requestJson(medicoApiBase)
}