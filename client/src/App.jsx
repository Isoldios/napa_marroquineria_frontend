import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthContext';

const RutaPrivadaAdmin = ({ children }) => {
  const { user, userData, loading } = useAuth();

  if (loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Cargando...</p>;

  // Si no hay usuario logueado O el rol no es admin, lo mandamos al Home
  if (!user || userData?.rol !== 'admin') {
    return <Navigate to="/" />;
  }

  // Si cumple todo, mostramos el componente hijo (AdminPanel)
  return children;
};

function App() {
  return (
    <BrowserRouter>
      {/* La Navbar va afuera de Routes para que se vea siempre */}
      <Navbar />
      
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* RUTA PRIVADA (ADMINISTRADORES) */}
        <Route 
          path="/admin" 
          element={
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