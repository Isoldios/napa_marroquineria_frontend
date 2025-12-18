// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PUBLICA (CLIENTES) */}
        <Route path="/" element={<Home />} />

        {/* RUTA PRIVADA (ADMINISTRADORES) */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;