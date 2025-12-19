// client/src/pages/CartPage.jsx
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Importar Auth
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { 
    carrito, 
    eliminarDelCarrito, 
    vaciarCarrito, 
    totalCompra, 
    agregarAlCarrito, 
    disminuirCantidad 
  } = useCart();

  const { user, userData } = useAuth(); // Traemos al usuario
  const navigate = useNavigate();

  // --- LÓGICA DE WHATSAPP ---
  const handleFinalizarCompra = () => {
    // 1. VERIFICACIÓN: ¿Está logueado?
    if (!user) {
      alert('Debes iniciar sesión para finalizar tu compra.');
      navigate('/login');
      return;
    }

    // 2. VERIFICACIÓN: ¿Tiene los datos completos?
    // Chequeamos userData de MongoDB
    if (!userData?.telefono || !userData?.direccion || !userData?.nombre) {
      alert('Necesitamos tus datos de contacto para el envío.');
      navigate('/completar-perfil');
      return;
    }

    // 3. Si pasa las validaciones, armamos el mensaje AUTOMÁTICAMENTE
    const numeroNegocio = '5491123733588'; // TU NÚMERO

    let mensaje = `Hola! 👋 Soy *${userData.nombre}* (Cliente Registrado).\n`;
    mensaje += `Quiero realizar el siguiente pedido:\n\n`;

    carrito.forEach((prod) => {
      const variante = prod.colorSeleccionado ? `(${prod.colorSeleccionado})` : '';
      mensaje += `🔹 *${prod.cantidad}x* ${prod.nombre} ${variante}\n`;
    });

    mensaje += `\n💰 *TOTAL A PAGAR: $${totalCompra}*\n`;
    mensaje += `\n📍 Mis datos de envío (Cargados en mi perfil):\n`;
    mensaje += `Tel: ${userData.telefono}\n`;
    mensaje += `Dirección: ${userData.direccion}\n`;
    mensaje += `Email: ${userData.email}\n`;

    const url = `https://wa.me/${numeroNegocio}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  if (carrito.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
        <h2>Tu carrito está vacío 😢</h2>
        <Link to="/" style={{ background: '#007bff', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', marginTop: '10px', display: 'inline-block' }}>
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Tu Carrito de Compras</h1>

      {/* --- TABLA DE PRODUCTOS (IGUAL QUE ANTES) --- */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Producto</th>
              <th style={{ padding: '10px' }}>Precio</th>
              <th style={{ padding: '10px' }}>Cant.</th>
              <th style={{ padding: '10px' }}>Subtotal</th>
              <th style={{ padding: '10px' }}></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((prod) => (
              <tr key={prod.cartItemId} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={prod.imagen || 'https://via.placeholder.com/50'} alt={prod.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <strong>{prod.nombre}</strong><br />
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{prod.marca}</span>
                    {prod.colorSeleccionado && <div style={{ fontSize: '0.85rem', color: '#007bff', fontWeight: 'bold' }}>Color: {prod.colorSeleccionado}</div>}
                  </div>
                </td>
                <td style={{ padding: '10px' }}>${prod.precio}</td>
                <td style={{ padding: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button onClick={() => disminuirCantidad(prod.cartItemId)} style={{ width: '30px', height: '30px', background: '#eee', border: 'none' }}>-</button>
                    <span style={{ margin: '0 10px', fontWeight: 'bold' }}>{prod.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(prod, prod.colorSeleccionado)} style={{ width: '30px', height: '30px', background: '#eee', border: 'none' }}>+</button>
                  </div>
                </td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>${prod.precio * prod.cantidad}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => eliminarDelCarrito(prod.cartItemId)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
         <button onClick={vaciarCarrito} style={{ background: 'none', border: '1px solid red', color: 'red', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>Vaciar Carrito</button>
      </div>

      {/* --- SECCIÓN DE TOTAL Y CHECKOUT --- */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <h2 style={{ marginBottom: '20px' }}>Total Final: ${totalCompra}</h2>

        {/* YA NO PEDIMOS DATOS MANUALES, USAMOS EL BOTÓN INTELIGENTE */}
        
        {!user ? (
            <p style={{color: '#666', marginBottom: '10px'}}>Inicia sesión para finalizar tu compra</p>
        ) : (
            <div style={{marginBottom: '15px', textAlign: 'right', fontSize: '0.9rem', color: '#555'}}>
                Vas a comprar como: <strong>{userData?.nombre || user.email}</strong><br/>
                Enviaremos a: {userData?.direccion || '(Falta dirección)'}
            </div>
        )}

        <button 
          onClick={handleFinalizarCompra}
          style={{ 
            background: '#25D366', color: 'white', padding: '15px 30px', 
            fontSize: '1.1rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}
        >
          {/* Icono Whatsapp */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382C17.119 14.205 15.396 13.36 15.074 13.243C14.751 13.126 14.516 13.067 14.281 13.419C14.046 13.771 13.371 14.564 13.165 14.799C12.959 15.034 12.753 15.064 12.4 14.888C12.047 14.712 10.909 14.338 9.56099 13.136C8.50299 12.193 7.78899 11.028 7.58299 10.676C7.37699 10.324 7.56099 10.133 7.73799 9.957C7.89699 9.799 8.09099 9.554 8.26699 9.349C8.44299 9.144 8.50199 8.997 8.61899 8.762C8.73599 8.527 8.67699 8.322 8.58899 8.146C8.50099 7.97 7.79599 6.237 7.50199 5.533C7.21599 4.848 6.92699 4.942 6.70899 4.933C6.50599 4.925 6.27099 4.925 6.03599 4.925C5.80099 4.925 5.41899 5.013 5.09599 5.365C4.77299 5.717 3.86199 6.568 3.86199 8.299C3.86199 10.03 5.18399 11.673 5.38899 11.967C5.59499 12.26 8.13999 16.182 12.037 17.865C12.964 18.266 13.687 18.506 14.249 18.685C15.342 19.032 16.335 18.983 17.115 18.867C17.986 18.737 19.795 17.769 20.177 16.695C20.559 15.621 20.559 14.711 20.441 14.506C20.324 14.301 20.089 14.177 19.736 14.001H17.472V14.382Z" /></svg>
          Finalizar Pedido en WhatsApp
        </button>
      </div>
    </div>
  );
};

export default CartPage;