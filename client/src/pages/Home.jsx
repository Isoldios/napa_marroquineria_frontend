import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css'; // <--- IMPORTAR CSS

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  
  // Listas para los selects
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const API_URL = `${import.meta.env.VITE_API_URL}/productos`;
  const API_AUX = `${import.meta.env.VITE_API_URL}/auxiliares`;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resProd = await axios.get(API_URL);
        setProductos(resProd.data);

        const resMarcas = await axios.get(`${API_AUX}/marcas`);
        setMarcas(resMarcas.data);

        const resCat = await axios.get(`${API_AUX}/categorias`);
        setCategorias(resCat.data);
      } catch (error) {
        console.error("Error cargando datos", error);
      }
    };
    cargarDatos();
  }, []);

  const productosFiltrados = productos.filter((prod) => {
    const coincideTexto = prod.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideMarca = filtroMarca ? prod.marca === filtroMarca : true;
    const coincideCat = filtroCategoria ? prod.categoria === filtroCategoria : true;
    return coincideTexto && coincideMarca && coincideCat;
  });

  const limpiarFiltros = () => {
    setFiltroTexto('');
    setFiltroMarca('');
    setFiltroCategoria('');
  };

  return (
    <div className="home-container">
      
      {/* HEADER */}
      <div className="home-header">
        <h1 className="home-title">Colección Exclusiva</h1>
        <p className="home-subtitle">Encuentra la calidad que buscas en cuero Napa</p>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="filters-bar">
        <input 
          type="text" 
          placeholder="Buscar carteras, bolsos..." 
          value={filtroTexto} 
          onChange={(e) => setFiltroTexto(e.target.value)}
          className="search-input"
        />

        <select 
          value={filtroMarca} 
          onChange={(e) => setFiltroMarca(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las Marcas</option>
          {marcas.map(m => <option key={m._id} value={m.nombre}>{m.nombre}</option>)}
        </select>

        <select 
          value={filtroCategoria} 
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las Categorías</option>
          {categorias.map(c => <option key={c._id} value={c.nombre}>{c.nombre}</option>)}
        </select>

        <button onClick={limpiarFiltros} className="btn-clear">
          Limpiar
        </button>
      </div>

      {/* GRILLA DE PRODUCTOS */}
      <div className="products-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <ProductCard key={producto._id} producto={producto} />
          ))
        ) : (
          <div className="no-results">
            <p>No encontramos productos que coincidan con tu búsqueda 😢</p>
            <button onClick={limpiarFiltros} style={{marginTop: '10px', color: '#007bff', background:'none', border:'none', cursor:'pointer', textDecoration:'underline'}}>
              Ver todo el catálogo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;