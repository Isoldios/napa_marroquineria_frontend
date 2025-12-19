import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Home = () => {
  // Estados de datos
  const [productos, setProductos] = useState([]); // Todos los productos (Base)
  const [productosFiltrados, setProductosFiltrados] = useState([]); // Los que se ven en pantalla
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const { agregarAlCarrito } = useCart();

  // Estados de los filtros seleccionados
  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // URLs CON EL FORMATO SOLICITADO
  const API_PRODUCTOS = `${import.meta.env.VITE_API_URL}/productos`;
  const API_AUXILIARES = `${import.meta.env.VITE_API_URL}/auxiliares`;

  // 1. Cargar Datos Iniciales (Productos y Listas)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Hacemos las peticiones en paralelo para que sea más rápido
        const [resProd, resMarcas, resCat] = await Promise.all([
          axios.get(API_PRODUCTOS),
          axios.get(`${API_AUXILIARES}/marcas`),
          axios.get(`${API_AUXILIARES}/categorias`)
        ]);

        setProductos(resProd.data);
        setProductosFiltrados(resProd.data); // Al inicio, mostramos todos
        setMarcas(resMarcas.data);
        setCategorias(resCat.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, []);

  // 2. Efecto para Aplicar Filtros
  // Se ejecuta cada vez que cambia un filtro o la lista de productos
  useEffect(() => {
    let resultado = productos;

    if (filtroMarca) {
      resultado = resultado.filter(p => p.marca === filtroMarca);
    }

    if (filtroCategoria) {
      resultado = resultado.filter(p => p.categoria === filtroCategoria);
    }

    setProductosFiltrados(resultado);
  }, [filtroMarca, filtroCategoria, productos]);


  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Napa Marroquinería</h1>
      
      {/* --- BARRA DE FILTROS --- */}
      <div style={{ 
        background: '#f4f4f4', padding: '15px', borderRadius: '8px', 
        marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap'
      }}>
        <strong>Filtrar por:</strong>
        
        {/* Select Marca */}
        <select 
          value={filtroMarca} 
          onChange={(e) => setFiltroMarca(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Todas las Marcas</option>
          {marcas.map(m => (
            <option key={m._id} value={m.nombre}>{m.nombre}</option>
          ))}
        </select>

        {/* Select Categoría */}
        <select 
          value={filtroCategoria} 
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Todas las Categorías</option>
          {categorias.map(c => (
            <option key={c._id} value={c.nombre}>{c.nombre}</option>
          ))}
        </select>

        {/* Botón limpiar filtros (Opcional pero útil) */}
        {(filtroMarca || filtroCategoria) && (
          <button 
            onClick={() => { setFiltroMarca(''); setFiltroCategoria(''); }}
            style={{ padding: '8px 15px', background: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Limpiar Filtros
          </button>
        )}

        <span style={{ marginLeft: 'auto', color: '#666' }}>
          Mostrando: {productosFiltrados.length} productos
        </span>
      </div>

      {/* --- GRILLA DE PRODUCTOS --- */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <div key={producto._id} style={{ 
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
              
              <button 
                onClick={() => {
                  agregarAlCarrito(producto);
                  alert('¡Producto agregado!'); // Opcional: Feedback visual simple
                }}
                // style={{ ...estilos }}
              >
                Agregar al Carrito
              </button>
            </div>
          ))
        ) : (
          <p style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>
            No se encontraron productos con esos filtros.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;