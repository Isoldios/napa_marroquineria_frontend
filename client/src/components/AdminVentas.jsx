import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminVentas.css'; 

const AdminVentas = () => {
  const [ordenes, setOrdenes] = useState([]); // Todas las ordenes
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]); // Ordenes que cumplen filtros
  const [loading, setLoading] = useState(true);

  // Estados de Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // Estados de Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  // Estado del Modal
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/ordenes`;

  // 1. Cargar Órdenes
  const cargarOrdenes = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin`);
      setOrdenes(res.data);
      setOrdenesFiltradas(res.data); // Inicialmente son todas
    } catch (error) {
      console.error("Error cargando ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  // 2. Efecto de Filtrado
  useEffect(() => {
    let resultado = ordenes;

    // Filtro por Texto (Nombre Cliente)
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(o => 
        o.datosEnvio?.nombre?.toLowerCase().includes(termino)
      );
    }

    // Filtro por Estado
    if (filtroEstado) {
      resultado = resultado.filter(o => o.estado === filtroEstado);
    }

    setOrdenesFiltradas(resultado);
    setPaginaActual(1); // Volver a pag 1 si filtramos
  }, [busqueda, filtroEstado, ordenes]);

  // 3. Cambiar Estado
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`${API_URL}/${id}`, { estado: nuevoEstado });
      // Actualizamos ambas listas
      const actualizarLista = (lista) => lista.map(o => o._id === id ? { ...o, estado: nuevoEstado } : o);
      setOrdenes(actualizarLista(ordenes));
      // Si el modal está abierto, actualizamos también su estado interno
      if (ordenSeleccionada && ordenSeleccionada._id === id) {
          setOrdenSeleccionada({ ...ordenSeleccionada, estado: nuevoEstado });
      }
    } catch (error) {
      alert("Error actualizando estado");
    }
  };

  // 4. Lógica de Paginación
  const indiceUltimo = paginaActual * elementosPorPagina;
  const indicePrimero = indiceUltimo - elementosPorPagina;
  const ordenesVisibles = ordenesFiltradas.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(ordenesFiltradas.length / elementosPorPagina);

  // 5. Helper de Agrupación (Para el modal)
  const agruparPorMarcaYCategoria = (productos) => {
    const grupos = {};
    productos.forEach((item) => {
      const marca = item.productoId?.marca || 'Otras Marcas';
      const categoria = item.productoId?.categoria || 'Varios';
      if (!grupos[marca]) grupos[marca] = {};
      if (!grupos[marca][categoria]) grupos[marca][categoria] = [];
      grupos[marca][categoria].push(item);
    });
    return grupos;
  };

  if (loading) return <p style={{padding:'20px', textAlign:'center'}}>Cargando sistema de ventas...</p>;

  return (
    <div className="ventas-container">
      
      {/* --- BARRA DE HERRAMIENTAS --- */}
      <div className="ventas-toolbar">
        <input 
            type="text" 
            placeholder="🔍 Buscar por ID o Cliente..." 
            className="search-input"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
        />
        
        <select 
            className="status-filter"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
        >
            <option value="">Todos los Estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {/* --- LISTA DE PEDIDOS --- */}
      {ordenesVisibles.length === 0 ? (
        <div style={{textAlign:'center', padding:'20px', color:'#777'}}>No se encontraron pedidos.</div>
      ) : (
        <div className="ordenes-list">
          {ordenesVisibles.map((orden) => (
            <div key={orden._id} className="orden-card">
                
                {/* Info Resumida */}
                <div className="orden-summary-info">
                    <span className="orden-id">#{orden._id.slice(-6).toUpperCase()}</span>
                    <span className="orden-cliente">👤 {orden.datosEnvio?.nombre}</span>
                    <small style={{color:'#888'}}>{new Date(orden.fecha).toLocaleDateString()}</small>
                </div>

                {/* Total */}
                <div className="orden-total-mini">
                    ${orden.total}
                </div>

                {/* Acciones */}
                <div className="orden-actions">
                    <select 
                        className={`estado-select-mini ${orden.estado.toLowerCase()}`}
                        value={orden.estado}
                        onChange={(e) => cambiarEstado(orden._id, e.target.value)}
                        onClick={(e) => e.stopPropagation()} // Evita abrir modal al cambiar estado
                    >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Pagado">Pagado</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>

                    <button 
                        className="btn-detalle"
                        onClick={() => setOrdenSeleccionada(orden)}
                    >
                        Ver Detalle
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}

      {/* --- PAGINACIÓN --- */}
      {totalPaginas > 1 && (
          <div className="pagination">
              <button 
                className="page-btn" 
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                  Anterior
              </button>
              <span>Página {paginaActual} de {totalPaginas}</span>
              <button 
                className="page-btn"
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                  Siguiente
              </button>
          </div>
      )}

      {/* --- MODAL DE DETALLE --- */}
      {ordenSeleccionada && (
        <div className="modal-overlay" onClick={() => setOrdenSeleccionada(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                
                {/* Header Modal */}
                <div className="modal-header">
                    <h3>Pedido #{ordenSeleccionada._id.slice(-6).toUpperCase()}</h3>
                    <button className="btn-close" onClick={() => setOrdenSeleccionada(null)}>×</button>
                </div>

                {/* Body Modal */}
                <div className="modal-body">
                    {/* Datos Cliente */}
                    <div style={{background:'#f9f9f9', padding:'15px', borderRadius:'8px', marginBottom:'20px'}}>
                        <p><strong>Cliente:</strong> {ordenSeleccionada.datosEnvio?.nombre}</p>
                        <p><strong>Teléfono:</strong> <a href={`https://wa.me/${ordenSeleccionada.datosEnvio?.telefono}`} target="_blank" rel="noreferrer" style={{color:'#007bff'}}>{ordenSeleccionada.datosEnvio?.telefono}</a></p>
                        <p><strong>Dirección:</strong> {ordenSeleccionada.datosEnvio?.direccion}</p>
                    </div>

                    {/* Lista Productos con Foto */}
                    <h4 style={{marginBottom:'10px', borderBottom:'2px solid #eee', paddingBottom:'5px'}}>Productos</h4>
                    
                    {/* Usamos el mapeo plano aquí para que sea una lista visual con foto */}
                    {ordenSeleccionada.productos.map((prod, idx) => (
                        <div key={idx} className="modal-prod-row">
                            <img 
                                src={prod.productoId?.imagen || 'https://via.placeholder.com/60'} 
                                alt={prod.nombre} 
                                className="modal-prod-img"
                            />
                            <div className="modal-prod-info">
                                <div style={{fontWeight:'bold'}}>{prod.nombre}</div>
                                <div style={{fontSize:'0.9rem', color:'#666'}}>
                                    {prod.productoId?.marca} - {prod.productoId?.categoria}
                                    {prod.color && <span> | Color: {prod.color}</span>}
                                </div>
                                <div style={{marginTop:'5px'}}>
                                    <span style={{background:'#eee', padding:'2px 6px', borderRadius:'4px', fontWeight:'bold', fontSize:'0.85rem'}}>{prod.cantidad} u.</span> 
                                    <span style={{marginLeft:'10px', fontWeight:'600'}}>${prod.precio * prod.cantidad}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div style={{textAlign:'right', marginTop:'20px', fontSize:'1.5rem', fontWeight:'800', color:'var(--primary)'}}>
                        Total: ${ordenSeleccionada.total}
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminVentas;