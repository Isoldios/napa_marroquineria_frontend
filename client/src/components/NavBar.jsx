import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

const Navbar = () => {
  const { cantidadTotal } = useCart();
  const { user, userData, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* LOGO */}
        <Link to="/" className="logo">
          NAPA MARROQUINERIA
        </Link>

        {/* ENLACES Y CARRITO */}
        <div className="nav-links">
          
          {/* Solo Admin ve esto */}
          {userData?.rol === 'admin' && (
            <Link to="/admin" className="nav-link" style={{ color: '#ffc107' }}>
              Panel Admin
            </Link>
          )}

          {/* Carrito con diseño de "Badge" */}
          <Link to="/carrito" className="cart-badge">
            <span>🛒</span>
            <span>{cantidadTotal}</span>
          </Link>

          {/* Sección Usuario */}
          {user ? (
            <div className="user-info">
              <span>Hola, {userData?.nombre?.split(' ')[0] || 'Cliente'}</span>
              <button onClick={logout} className="btn-logout">Salir</button>
            </div>
          ) : (
            <Link to="/login" className="nav-link">
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;