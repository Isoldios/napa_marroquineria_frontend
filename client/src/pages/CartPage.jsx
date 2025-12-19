import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { 
    carrito, 
    eliminarDelCarrito, 
    vaciarCarrito, 
    totalCompra, 
    agregarAlCarrito, 
    disminuirCantidad 
  } = useCart();

  // Si el carrito está vacío, mostramos un mensaje amigable
  if (carrito.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Tu carrito está vacío 😢</h2>
        <p>¡Agrega algunos productos para empezar!</p>
        <Link to="/" style={{ 
          background: '#007bff', color: 'white', padding: '10px 20px', 
          textDecoration: 'none', borderRadius: '5px', marginTop: '10px', display: 'inline-block' 
        }}>
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Tu Carrito de Compras</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Producto</th>
            <th style={{ padding: '10px' }}>Precio</th>
            <th style={{ padding: '10px' }}>Cantidad</th>
            <th style={{ padding: '10px' }}>Subtotal</th>
            <th style={{ padding: '10px' }}></th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((prod) => (
            // USAMOS prod.cartItemId COMO KEY, NO prod._id
            <tr key={prod.cartItemId} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img 
                  src={prod.imagen || 'https://via.placeholder.com/50'} 
                  alt={prod.nombre} 
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                  <strong>{prod.nombre}</strong>
                  <br />
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>{prod.marca}</span>
                  
                  {/* --- MOSTRAR EL COLOR SELECCIONADO --- */}
                  {prod.colorSeleccionado && (
                    <div style={{ fontSize: '0.85rem', color: '#007bff', fontWeight: 'bold' }}>
                      Color: {prod.colorSeleccionado}
                    </div>
                  )}
                </div>
              </td>
              <td style={{ padding: '10px' }}>${prod.precio}</td>
              <td style={{ padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {/* Usamos cartItemId en las funciones */}
                  <button 
                    onClick={() => disminuirCantidad(prod.cartItemId)}
                    style={{ width: '30px', height: '30px', cursor: 'pointer', background: '#eee', border: 'none' }}
                  >
                    -
                  </button>
                  <span style={{ margin: '0 10px', fontWeight: 'bold' }}>{prod.cantidad}</span>
                  {/* Para sumar, llamamos a agregar pasando el mismo producto y color */}
                  <button 
                    onClick={() => agregarAlCarrito(prod, prod.colorSeleccionado)}
                    style={{ width: '30px', height: '30px', cursor: 'pointer', background: '#eee', border: 'none' }}
                  >
                    +
                  </button>
                </div>
              </td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>
                ${prod.precio * prod.cantidad}
              </td>
              <td style={{ padding: '10px' }}>
                <button 
                  onClick={() => eliminarDelCarrito(prod.cartItemId)}
                  style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FOOTER DEL CARRITO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
        <button 
          onClick={vaciarCarrito}
          style={{ background: 'none', border: '1px solid red', color: 'red', padding: '10px 15px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Vaciar Carrito
        </button>

        <div style={{ textAlign: 'right' }}>
          <h2 style={{ marginBottom: '10px' }}>Total: ${totalCompra}</h2>
          
          <button 
            onClick={() => alert('¡Próximamente conectaremos esto a WhatsApp o MercadoPago!')}
            style={{ 
              background: '#28a745', color: 'white', padding: '15px 30px', 
              fontSize: '1.1rem', border: 'none', borderRadius: '5px', cursor: 'pointer' 
            }}
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;