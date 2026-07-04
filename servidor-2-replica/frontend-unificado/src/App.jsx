import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import AtencionPage from './pages/AtencionPage';
import MedicoPage from './pages/MedicoPage';
import LaboratorioPage from './pages/LaboratorioPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f6faff] text-[#141d23]">
        <nav className="bg-white border-b border-[#c2c6d4]">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#003f87]">MedCenter</h1>

            <div className="flex gap-6">
              <Link className="font-semibold text-[#003f87] hover:text-[#0052a5] transition-colors" to="/">
                Atención
              </Link>
              <Link className="font-semibold text-[#003f87] hover:text-[#0052a5] transition-colors" to="/medico">
                Médico
              </Link>
              <Link className="font-semibold text-[#003f87] hover:text-[#0052a5] transition-colors" to="/laboratorio">
                Laboratorio
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<AtencionPage />} />
            <Route path="/medico" element={<MedicoPage />} />
            <Route path="/laboratorio" element={<LaboratorioPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;