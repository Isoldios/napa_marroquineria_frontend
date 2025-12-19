// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* RUTA PUBLICA (CLIENTES) */}
        <Route path="/" element={<Home />} />
        <Route path="/carrito" element={<CartPage />} />

        {/* RUTA PRIVADA (ADMINISTRADORES) */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;