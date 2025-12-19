import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ producto }) => {
  const { agregarAlCarrito } = useCart();
  const [colorElegido, setColorElegido] = useState('');

  const handleAgregar = () => {
    if (producto.tieneColores && !colorElegido) {
      alert('Por favor, selecciona un color.');
      return;
    }
    agregarAlCarrito(producto, colorElegido);
  };

  return (
    <div className="product-card">
      <div className="card-image-container">
        <img 
          src={producto.imagen || 'https://via.placeholder.com/300x300?text=Sin+Imagen'} 
          alt={producto.nombre} 
          className="card-image"
        />
      </div>
      
      <div className="card-content">
        <span className="card-brand">{producto.marca} | {producto.categoria}</span>
        <h3 className="card-title" title={producto.nombre}>{producto.nombre}</h3>
        <div className="card-price">${producto.precio}</div>

        <div className="card-actions">
          {/* SELECTOR DE COLOR */}
          {producto.tieneColores && (
            <select 
              className="color-selector"
              value={colorElegido}
              onChange={(e) => setColorElegido(e.target.value)}
            >
              <option value="">Seleccionar Color</option>
              {producto.stockPorColor.map((variante, idx) => (
                <option key={idx} value={variante.nombre}>
                  {variante.nombre} ({variante.cantidad})
                </option>
              ))}
            </select>
          )}

          <button 
            className="btn-add"
            onClick={handleAgregar}
            disabled={producto.stock <= 0}
          >
            {producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;