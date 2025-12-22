import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './MisCompras.css';

const MisCompras = () => {
  const { userData, loading } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [cargandoOrdenes, setCargandoOrdenes] = useState(true);

  useEffect(() => {
    const fetchOrdenes = async () => {
      if (userData?._id) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/ordenes/usuario/${userData._id}`);
          setOrdenes(res.data);
        } catch (error) {
          console.error(error);
        } finally {
          setCargandoOrdenes(false);
        }
      }
    };
    if (!loading) fetchOrdenes();
  }, [userData, loading]);

  // --- FUNCIÓN HELPER PARA AGRUPAR ---
  const agruparPorMarcaYCategoria = (productos) => {
    const grupos = {};

    productos.forEach((item) => {
      // Intentamos sacar la marca del producto poblado, o usamos un fallback
      // Nota: item.productoId es el objeto completo gracias al .populate() del backend
      const marca = item.productoId?.marca || 'Otras Marcas';
      const categoria = item.productoId?.categoria || 'Varios';

      if (!grupos[marca]) grupos[marca] = {};
      if (!grupos[marca][categoria]) grupos[marca][categoria] = [];

      grupos[marca][categoria].push(item);
    });

    return grupos;
  };

  if (loading || cargandoOrdenes) return <div style={{padding:'40px', textAlign:'center'}}>Cargando historial...</div>;

  if (ordenes.length === 0) {
    return (
      <div className="compras-container" style={{textAlign:'center'}}>
        <h2>No tienes compras registradas 🛍️</h2>
        <Link to="/" className="btn-back">Ir a la Tienda</Link>
      </div>
    );
  }

  return (
    <div className="compras-container">
      <h2>Mis Compras</h2>
      
      <div className="lista-ordenes">
        {ordenes.map((orden) => {
          // Agrupamos los productos de ESTA orden
          const productosAgrupados = agruparPorMarcaYCategoria(orden.productos);

          return (
            <div key={orden._id} className="orden-card-cliente">
              
              {/* CABECERA DE LA ORDEN */}
              <div className="orden-header">
                <div>
                    <span className="orden-fecha">📅 {new Date(orden.fecha).toLocaleDateString()}</span>
                    <span className="orden-id-visual">#{orden._id.slice(-6).toUpperCase()}</span>
                </div>
                <span className={`estado-tag ${orden.estado.toLowerCase()}`}>{orden.estado}</span>
              </div>
              
              {/* CUERPO AGRUPADO */}
              <div className="orden-body">
                {Object.keys(productosAgrupados).sort().map(marca => (
                  <div key={marca} className="grupo-marca">
                    <h4 className="marca-titulo">{marca}</h4>
                    
                    {Object.keys(productosAgrupados[marca]).sort().map(cat => (
                      <div key={cat} className="grupo-categoria">
                        <h5 className="cat-titulo">{cat}</h5>
                        
                        {productosAgrupados[marca][cat].map((prod, idx) => (
                          <div key={idx} className="item-resumen">
                            <div className="item-info">
                                <span className="item-qty">{prod.cantidad}x</span>
                                <span>{prod.nombre}</span>
                                {prod.color && <span className="item-color">({prod.color})</span>}
                            </div>
                            <span className="item-price">${prod.precio * prod.cantidad}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* FOOTER TOTAL */}
              <div className="orden-footer">
                <span className="total-label">Total Pagado:</span>
                <span className="total-monto">${orden.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MisCompras;