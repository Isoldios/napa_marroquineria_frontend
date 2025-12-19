import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cantidadTotal } = useCart();
  const { user, userData, logout } = useAuth();

  return (
    <nav style={{ 
      background: '#333', color: '#fff', padding: '15px 30px', 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Napa Marroquinería
      </Link>

      <div style={{ display: 'flex', gap: '20px' }}>
        {userData?.rol === 'admin' && (
          <Link to="/admin" style={{ color: '#aaa', marginRight: '15px' }}>Panel Admin</Link>
        )}
        {user ? (
            <div style={{ display: 'inline-block', marginLeft: '15px' }}>
                <span>Hola, {userData?.nombre || user.email}</span>
                <button onClick={logout} style={{ marginLeft: '10px', background: 'red', border: 'none', color: 'white', cursor: 'pointer' }}>Salir</button>
            </div>
        ) : (
            <Link to="/login" style={{ color: 'white', marginLeft: '15px' }}>Ingresar</Link>
        )}
        
        {/* Enlace al Carrito (luego crearemos la página /carrito) */}
        <Link to="/carrito" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          🛒 Carrito ({cantidadTotal})
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;