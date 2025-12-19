import { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ producto }) => {
  const { agregarAlCarrito } = useCart();
  
  // Estado local: Qué color eligió el usuario en ESTA tarjeta
  const [colorElegido, setColorElegido] = useState('');

  const handleAgregar = () => {
    // 1. Si el producto tiene colores y el usuario no eligió nada: ERROR
    if (producto.tieneColores && !colorElegido) {
      alert('Por favor, selecciona un color antes de agregar.');
      return;
    }

    // 2. Agregamos al carrito pasando el producto Y el color
    agregarAlCarrito(producto, colorElegido);
    
    // (Opcional) Feedback visual
    // alert(`Agregaste ${producto.nombre} ${colorElegido ? colorElegido : ''}`);
  };

  return (
    <div style={{ 
      border: '1px solid #eee', borderRadius: '8px', padding: '15px', width: '250px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)', background: 'white', display: 'flex', flexDirection: 'column'
    }}>
      <img 
        src={producto.imagen || 'https://via.placeholder.com/200x200?text=Sin+Imagen'} 
        alt={producto.nombre} 
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} 
      />
      
      <h3 style={{ fontSize: '1.1rem', margin: '0 0 5px 0' }}>{producto.nombre}</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', margin: '0' }}>{producto.marca} - {producto.categoria}</p>
      <h4 style={{ fontSize: '1.2rem', margin: '10px 0', color: '#333' }}>${producto.precio}</h4>

      {/* --- SELECTOR DE COLOR (Solo si tieneColores es true) --- */}
      {producto.tieneColores && (
        <div style={{ marginBottom: '10px' }}>
          <select 
            value={colorElegido}
            onChange={(e) => setColorElegido(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
          >
            <option value="">-- Seleccionar Color --</option>
            {producto.stockPorColor.map((variante, idx) => (
              <option key={idx} value={variante.nombre}>
                {variante.nombre} ({variante.cantidad} disp.)
              </option>
            ))}
          </select>
        </div>
      )}

      <button 
        onClick={handleAgregar}
        style={{ 
          marginTop: 'auto', padding: '10px', 
          background: producto.stock > 0 ? '#222' : '#ccc', 
          color: 'white', border: 'none', borderRadius: '4px', 
          cursor: producto.stock > 0 ? 'pointer' : 'not-allowed', 
          fontWeight: 'bold' 
        }}
        disabled={producto.stock <= 0}
      >
        {producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
      </button>
    </div>
  );
};

export default ProductCard;