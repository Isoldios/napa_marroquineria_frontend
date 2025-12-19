// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import NavBar from './components/NavBar';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import CompletarPerfil from './pages/CompletarPerfil';
import { useAuth } from './context/AuthContext';

const RutaPrivadaAdmin = ({ children }) => {
    const { user, userData, loading } = useAuth();
    if (loading) return <p>Cargando...</p>;
    if (!user || userData?.rol !== 'admin') return <Navigate to="/" />;
    return children;
};

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Rutas Públicas (Cualquiera puede ver productos y armar carrito) */}
        <Route path="/" element={<Home />} />
        <Route path="/carrito" element={<CartPage />} />
        
        <Route path="/login" element={<LoginPage />} />
        
        {/* Solo accesible si faltan datos */}
        <Route path="/completar-perfil" element={<CompletarPerfil />} />

        {/* Ruta Admin */}
        <Route path="/admin" element={
            <RutaPrivadaAdmin>
              <AdminPanel />
            </RutaPrivadaAdmin>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;