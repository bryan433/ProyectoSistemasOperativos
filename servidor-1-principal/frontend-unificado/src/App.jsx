import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import AtencionPage from './pages/AtencionPage';
import MedicoPage from './pages/MedicoPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f6faff] text-[#141d23]">
        <nav className="bg-white border-b border-[#c2c6d4]">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#003f87]">MedCenter</h1>

            <div className="flex gap-6">
              <Link className="font-semibold text-[#003f87]" to="/">
                Atención
              </Link>
              <Link className="font-semibold text-[#003f87]" to="/medico">
                Médico
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<AtencionPage />} />
            <Route path="/medico" element={<MedicoPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;