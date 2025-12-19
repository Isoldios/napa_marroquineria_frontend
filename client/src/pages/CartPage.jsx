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

        const numeroNegocio = '5491112345678'; 
        let mensaje = `Hola! 👋 Soy *${userData.nombre}*.\nHe registrado el *Pedido #${ordenIdCorta}* en la web.\n\nDetalle:\n`;
        carrito.forEach((prod) => {
            mensaje += `🔹 *${prod.cantidad}x* ${prod.nombre} ${prod.colorSeleccionado ? `(${prod.colorSeleccionado})` : ''}\n`;
        });
        mensaje += `\n💰 *TOTAL: $${totalCompra}*\n`;
        
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

      {/* --- NUEVA ESTRUCTURA GRID (Reemplaza a la tabla) --- */}
      <div className="cart-grid">
        {/* Encabezados (Solo visible en PC) */}
        <div className="cart-header-row">
          <span>Producto</span>
          <span>Precio Unit.</span>
          <span style={{textAlign: 'center'}}>Cantidad</span>
          <span style={{textAlign: 'right'}}>Subtotal</span>
          <span style={{textAlign: 'center'}}>Borrar</span>
        </div>

        {/* Lista de Items */}
        {carrito.map((prod) => (
          <div key={prod.cartItemId} className="cart-item">
            
            {/* 1. Imagen */}
            <div className="c-img-container">
               <img src={prod.imagen || 'https://via.placeholder.com/60'} alt={prod.nombre} className="c-img" />
            </div>

            {/* 2. Info (Nombre, Marca, Color) */}
            <div className="c-info">
              <strong>{prod.nombre}</strong>
              <span className="c-brand">{prod.marca}</span>
              {prod.colorSeleccionado && <span className="c-variant">Color: {prod.colorSeleccionado}</span>}
            </div>

            {/* 3. Precio Unitario (Se oculta en móvil) */}
            <div className="c-price">${prod.precio}</div>

            {/* 4. Controles de Cantidad */}
            <div className="c-qty">
              <button className="btn-qty" onClick={() => disminuirCantidad(prod.cartItemId)}>-</button>
              <span className="qty-number">{prod.cantidad}</span>
              <button className="btn-qty" onClick={() => agregarAlCarrito(prod, prod.colorSeleccionado)}>+</button>
            </div>

            {/* 5. Subtotal */}
            <div className="c-subtotal">${prod.precio * prod.cantidad}</div>

            {/* 6. Botón Borrar */}
            <button className="c-del" onClick={() => eliminarDelCarrito(prod.cartItemId)}>
                {/* Icono tacho de basura SVG */}
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