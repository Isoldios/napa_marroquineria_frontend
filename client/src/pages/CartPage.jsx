import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const CartPage = () => {
  const { 
    carrito, 
    eliminarDelCarrito, 
    vaciarCarrito, 
    totalCompra, 
    agregarAlCarrito, 
    disminuirCantidad 
  } = useCart();

  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  const handleFinalizarCompra = async () => {
    if (!user) { alert('Debes iniciar sesión para finalizar.'); navigate('/login'); return; }
    if (!userData?.telefono || !userData?.direccion) { alert('Completa tus datos de envío.'); navigate('/completar-perfil'); return; }

    setProcesando(true);
    try {
        // 1. Guardar en Base de Datos (Igual que antes)
        const nuevaOrden = {
            usuario: userData._id,
            productos: carrito.map(prod => ({
                productoId: prod._id,
                nombre: prod.nombre,
                cantidad: prod.cantidad,
                precio: prod.precio,
                color: prod.colorSeleccionado || ''
            })),
            total: totalCompra,
            datosEnvio: { nombre: userData.nombre, direccion: userData.direccion, telefono: userData.telefono, email: userData.email }
        };

        const API_URL = `${import.meta.env.VITE_API_URL}/ordenes`;
        const respuesta = await axios.post(API_URL, nuevaOrden);
        const ordenIdCorta = respuesta.data._id.slice(-6).toUpperCase(); 

        // 2. LÓGICA DE AGRUPACIÓN PARA WHATSAPP
        const grupos = {};

        // Paso A: Organizar el carrito en un objeto { Marca: { Categoria: [Productos] } }
        carrito.forEach(prod => {
            const marca = prod.marca || 'Otras Marcas';
            const categoria = prod.categoria || 'Varios';

            if (!grupos[marca]) grupos[marca] = {};
            if (!grupos[marca][categoria]) grupos[marca][categoria] = [];

            grupos[marca][categoria].push(prod);
        });

        // Paso B: Construir el mensaje de texto recorriendo los grupos
        const numeroNegocio = '+5491135595047'; 
        let mensaje = `Hola! 👋 Soy *${userData.nombre}*.\n`;
        mensaje += `He registrado el *Pedido #${ordenIdCorta}* en la web.\n\n`;
        mensaje += `📝 *DETALLE DEL PEDIDO:*\n`;

        // Recorremos las Marcas
        Object.keys(grupos).sort().forEach(marca => {
            mensaje += `\n⚫ *MARCA: ${marca.toUpperCase()}*\n`; 

            const categorias = grupos[marca];
            
            // Recorremos las Categorías dentro de la Marca
            Object.keys(categorias).sort().forEach(cat => {
                mensaje += `   📂 _${cat}_\n`; 

                // Listamos los productos
                categorias[cat].forEach(prod => {
                    const variante = prod.colorSeleccionado ? `(${prod.colorSeleccionado})` : '';
                    mensaje += `      ▪️ *${prod.cantidad}x* ${prod.nombre} ${variante}\n`;
                });
            });
            mensaje += `────────────────\n`; // Separador entre marcas
        });

        mensaje += `\n💰 *TOTAL A PAGAR: $${totalCompra}*\n`;
        
        window.open(`https://wa.me/${numeroNegocio}?text=${encodeURIComponent(mensaje)}`, '_blank');
        vaciarCarrito();

    } catch (error) {
        console.error("Error", error);
        alert("Hubo un error al procesar el pedido.");
    } finally {
        setProcesando(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="cart-container" style={{textAlign:'center'}}>
        <h2 className="cart-title">Tu carrito está vacío 😢</h2>
        <Link to="/" className="btn-primary" style={{display:'inline-block', textDecoration:'none'}}>Ir a la Tienda</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Tu Carrito ({carrito.length} u.)</h1>

      {/* --- ESTRUCTURA GRID --- */}
      <div className="cart-grid">
        <div className="cart-header-row">
          <span>Producto</span>
          <span>Precio Unit.</span>
          <span style={{textAlign: 'center'}}>Cantidad</span>
          <span style={{textAlign: 'right'}}>Subtotal</span>
          <span style={{textAlign: 'center'}}>Borrar</span>
        </div>

        {carrito.map((prod) => (
          <div key={prod.cartItemId} className="cart-item">
            
            <div className="c-img-container">
               <img src={prod.imagen || 'https://via.placeholder.com/60'} alt={prod.nombre} className="c-img" />
            </div>

            <div className="c-info">
              <strong>{prod.nombre}</strong>
              <span className="c-brand">{prod.marca}</span>
              {prod.colorSeleccionado && <span className="c-variant">Color: {prod.colorSeleccionado}</span>}
            </div>

            <div className="c-price">${prod.precio}</div>

            <div className="c-qty">
              <button className="btn-qty" onClick={() => disminuirCantidad(prod.cartItemId)}>-</button>
              <span className="qty-number">{prod.cantidad}</span>
              <button className="btn-qty" onClick={() => agregarAlCarrito(prod, prod.colorSeleccionado)}>+</button>
            </div>

            <div className="c-subtotal">${prod.precio * prod.cantidad}</div>

            <button className="c-del" onClick={() => eliminarDelCarrito(prod.cartItemId)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="cart-actions-row">
        <button className="btn-empty" onClick={vaciarCarrito}>Vaciar Carrito</button>
      </div>

      <div className="cart-summary">
        <div className="summary-row">Total Final: ${totalCompra}</div>

        {user && (
            <div className="user-details">
                Vas a comprar como: <strong>{userData?.nombre}</strong><br/>
                Enviaremos a: {userData?.direccion}
            </div>
        )}

        <button disabled={procesando} onClick={handleFinalizarCompra} className="btn-whatsapp">
          {procesando ? 'Procesando...' : 'Finalizar Pedido'}
        </button>
      </div>
    </div>
  );
};

export default CartPage;