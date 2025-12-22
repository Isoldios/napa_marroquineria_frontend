import { useState, useEffect } from 'react';
import axios from 'axios';
import GestorAuxiliares from '../components/GestorAuxiliares';
import FormularioProducto from '../components/FormularioProducto';
import AdminVentas from '../components/AdminVentas'; // <--- 1. IMPORTANTE: IMPORTAR COMPONENTE
import './AdminPanel.css';

const AdminPanel = () => {
  // Estado para controlar las pestañas: 'productos' o 'ventas'
  const [tab, setTab] = useState('productos'); 

  // --- ESTADOS DE PRODUCTOS ---
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarAux, setMostrarAux] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  // --- ESTADOS DE FILTROS ---
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [listaMarcas, setListaMarcas] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);

  const API_URL = `${import.meta.env.VITE_API_URL}/productos`;
  const API_AUX = `${import.meta.env.VITE_API_URL}/auxiliares`;

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [resProd, resMarcas, resCat] = await Promise.all([
        axios.get(API_URL),
        axios.get(`${API_AUX}/marcas`),
        axios.get(`${API_AUX}/categorias`)
      ]);
      setProductos(resProd.data);
      setListaMarcas(resMarcas.data);
      setListaCategorias(resCat.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = productos.filter(prod => {
    const coincideTexto = prod.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideMarca = filtroMarca ? prod.marca === filtroMarca : true;
    const coincideCat = filtroCategoria ? prod.categoria === filtroCategoria : true;
    return coincideTexto && coincideMarca && coincideCat;
  });

  // --- FUNCIONES CRUD ---
  const guardarProducto = async (producto) => {
    try {
      if (producto._id) {
        await axios.put(`${API_URL}/${producto._id}`, producto);
      } else {
        await axios.post(API_URL, producto);
      }
      cargarDatos();
      setMostrarForm(false);
      setProductoEditar(null);
    } catch (error) {
      alert("Error al guardar");
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      cargarDatos();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const abrirEditar = (prod) => {
    setProductoEditar(prod);
    setMostrarForm(true);
  };

  const cerrarModal = () => {
    setMostrarForm(false);
    setProductoEditar(null);
  };

  return (
    <div className="admin-container">
      
      {/* CABECERA CON PESTAÑAS */}
      <div className="admin-header-row">
        <h1 className="admin-title">Panel de Administración</h1>
        
        {/* 2. BOTONES DE PESTAÑAS */}
        <div className="admin-tabs">
            <button 
                className={`tab-btn ${tab === 'productos' ? 'active' : ''}`} 
                onClick={() => setTab('productos')}
            >
                📦 Productos
            </button>
            <button 
                className={`tab-btn ${tab === 'ventas' ? 'active' : ''}`} 
                onClick={() => setTab('ventas')}
            >
                💰 Ventas
            </button>
        </div>
      </div>

      {/* --- CONTENIDO CONDICIONAL --- */}
      
      {/* VISTA A: GESTIÓN DE VENTAS */}
      {tab === 'ventas' && (
          <div className="fade-in">
              <AdminVentas />
          </div>
      )}

      {/* VISTA B: GESTIÓN DE PRODUCTOS (Todo tu código anterior) */}
      {tab === 'productos' && (
        <div className="fade-in">
            {/* BARRA DE HERRAMIENTAS */}
            <div className="admin-toolbar">
                <div className="admin-actions">
                <button className="btn-new" onClick={() => { setProductoEditar(null); setMostrarForm(true); }}>
                    + Nuevo Producto
                </button>
                <button className="btn-aux" onClick={() => setMostrarAux(!mostrarAux)}>
                    {mostrarAux ? 'Ocultar Auxiliares' : '⚙️ Gestionar Marcas/Categorías'}
                </button>
                </div>

                <div className="admin-filters">
                <input 
                    className="filter-input search-main"
                    type="text" 
                    placeholder="Buscar por nombre..." 
                    value={filtroTexto}
                    onChange={e => setFiltroTexto(e.target.value)}
                />
                <select className="filter-select" value={filtroMarca} onChange={e => setFiltroMarca(e.target.value)}>
                    <option value="">Todas las Marcas</option>
                    {listaMarcas.map(m => <option key={m._id} value={m.nombre}>{m.nombre}</option>)}
                </select>
                <select className="filter-select" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
                    <option value="">Todas las Categorías</option>
                    {listaCategorias.map(c => <option key={c._id} value={c.nombre}>{c.nombre}</option>)}
                </select>
                </div>
            </div>

            {/* PANEL AUXILIARES */}
            {mostrarAux && (
                <div className="aux-panel">
                <GestorAuxiliares />
                </div>
            )}

            {/* TABLA PRODUCTOS */}
            <div className="table-container">
                {cargando ? <p style={{padding: '20px'}}>Cargando...</p> : (
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Img</th>
                        <th>Nombre</th>
                        <th>Marca / Cat.</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productosFiltrados.map(prod => {
                        const stockReal = prod.tieneColores 
                        ? prod.stockPorColor.reduce((acc, el) => acc + Number(el.cantidad), 0)
                        : prod.stock;
                        
                        let stockClass = 'in-stock';
                        if (stockReal === 0) stockClass = 'no-stock';
                        else if (stockReal < 5) stockClass = 'low-stock';

                        return (
                        <tr key={prod._id}>
                            <td data-label="Imagen">
                            <img src={prod.imagen || 'https://via.placeholder.com/50'} alt="" className="img-thumb"/>
                            </td>
                            <td data-label="Nombre">
                            <strong>{prod.nombre}</strong>
                            {prod.tieneColores && <div style={{fontSize:'0.8rem', color:'#666'}}>Variantes</div>}
                            </td>
                            <td data-label="Detalle">
                            {prod.marca} <br/> <small>{prod.categoria}</small>
                            </td>
                            <td data-label="Precio">
                            ${prod.precio}
                            </td>
                            <td data-label="Stock">
                            <span className={`stock-badge ${stockClass}`}>
                                {stockReal} u.
                            </span>
                            </td>
                            <td data-label="Acciones">
                            <div className="actions-cell">
                                <button className="btn-icon btn-edit" title="Editar" onClick={() => abrirEditar(prod)}>✏️</button>
                                <button className="btn-icon btn-delete" title="Eliminar" onClick={() => eliminarProducto(prod._id)}>🗑️</button>
                            </div>
                            </td>
                        </tr>
                        );
                    })}
                    {productosFiltrados.length === 0 && (
                        <tr><td colSpan="6" style={{textAlign:'center', padding:'30px'}}>No se encontraron productos.</td></tr>
                    )}
                    </tbody>
                </table>
                )}
            </div>

            {/* MODAL FORMULARIO */}
            {mostrarForm && (
                <FormularioProducto 
                productoEditar={productoEditar}
                cerrarFormulario={cerrarModal}
                alGuardar={guardarProducto}
                />
            )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;