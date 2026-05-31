import { useState } from 'react'
import './App.css'

function App() {
  const [fichas, setFichas] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFichas = async () => {
    setLoading(true)
    setError(null)
    try {
      // Llamada al Contenedor 5 (Backend Ficha Médica) a través de Nginx (o directo para demo)
      // En demo local sin Nginx aún, apuntamos al localhost:3002
      const response = await fetch('http://localhost:3002/api/fichas')
      if (!response.ok) throw new Error('Error en la respuesta del servidor')
      const data = await response.json()
      setFichas(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Módulo Médico</h1>
      <p>Interfaz simple para pruebas de conexión con el Backend Ficha Médica</p>
      
      <button 
        className="action-btn" 
        onClick={fetchFichas}
        disabled={loading}
      >
        {loading ? 'Consultando...' : 'Obtener Fichas Médicas'}
      </button>

      {error && (
        <div className="result-card" style={{borderColor: '#ef4444'}}>
          <h3 style={{color: '#ef4444'}}>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {fichas && !error && (
        <div className="result-card">
          <h3>Resultados de la BD:</h3>
          <pre>
            {JSON.stringify(fichas, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default App
