import { useState, useEffect } from 'react';
import axios from 'axios';
import './GestorAuxiliares.css'; // <--- IMPORTAR EL CSS

const GestorAuxiliares = () => {
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);

  // Inputs controlados
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [nuevoColor, setNuevoColor] = useState('');

  const API_AUX = `${import.meta.env.VITE_API_URL}/auxiliares`;

  // Cargar datos
  const cargarAuxiliares = async () => {
    try {
      const [resM, resC, resCol] = await Promise.all([
        axios.get(`${API_AUX}/marcas`),
        axios.get(`${API_AUX}/categorias`),
        axios.get(`${API_AUX}/colores`)
      ]);
      setMarcas(resM.data);
      setCategorias(resC.data);
      setColores(resCol.data);
    } catch (error) {
      console.error("Error cargando auxiliares", error);
    }
  };

  useEffect(() => {
    cargarAuxiliares();
  }, []);

  // Guardar (Genérico)
  const guardar = async (tipo, valor, setValor) => {
    if (!valor.trim()) return;
    try {
      let endpoint = '';
      let payload = {};

      if (tipo === 'marca') { endpoint = 'marcas'; payload = { nombre: valor }; }
      if (tipo === 'categoria') { endpoint = 'categorias'; payload = { nombre: valor }; }
      if (tipo === 'color') { endpoint = 'colores'; payload = { nombre: valor }; }

      await axios.post(`${API_AUX}/${endpoint}`, payload);
      setValor(''); // Limpiar input
      cargarAuxiliares(); // Recargar listas
    } catch (error) {
      alert('Error al guardar');
    }
  };

  // Eliminar (Genérico)
  const eliminar = async (tipo, id) => {
    if (!window.confirm('¿Eliminar este elemento?')) return;
    try {
      let endpoint = '';
      if (tipo === 'marca') endpoint = 'marcas';
      if (tipo === 'categoria') endpoint = 'categorias';
      if (tipo === 'color') endpoint = 'colores';

      await axios.delete(`${API_AUX}/${endpoint}/${id}`);
      cargarAuxiliares();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="aux-container">
      <div className="aux-grid">
        
        {/* TARJETA MARCAS */}
        <div className="aux-card">
          <h3 className="aux-title">Marcas</h3>
          
          <div className="aux-list">
            {marcas.map(m => (
              <div key={m._id} className="aux-tag">
                {m.nombre}
                <button className="btn-delete-tag" onClick={() => eliminar('marca', m._id)}>×</button>
              </div>
            ))}
          </div>

          <div className="aux-form">
            <input 
              className="aux-input"
              value={nuevaMarca} 
              onChange={e => setNuevaMarca(e.target.value)} 
              placeholder="Nueva Marca" 
            />
            <button className="btn-add-aux" onClick={() => guardar('marca', nuevaMarca, setNuevaMarca)}>
              +
            </button>
          </div>
        </div>

        {/* TARJETA CATEGORÍAS */}
        <div className="aux-card">
          <h3 className="aux-title">Categorías</h3>
          
          <div className="aux-list">
            {categorias.map(c => (
              <div key={c._id} className="aux-tag">
                {c.nombre}
                <button className="btn-delete-tag" onClick={() => eliminar('categoria', c._id)}>×</button>
              </div>
            ))}
          </div>

          <div className="aux-form">
            <input 
              className="aux-input"
              value={nuevaCategoria} 
              onChange={e => setNuevaCategoria(e.target.value)} 
              placeholder="Nueva Categoría" 
            />
            <button className="btn-add-aux" onClick={() => guardar('categoria', nuevaCategoria, setNuevaCategoria)}>
              +
            </button>
          </div>
        </div>

        {/* TARJETA COLORES */}
        <div className="aux-card">
          <h3 className="aux-title">Colores</h3>
          
          <div className="aux-list">
            {colores.map(c => (
              <div key={c._id} className="aux-tag">
                {c.nombre}
                <button className="btn-delete-tag" onClick={() => eliminar('color', c._id)}>×</button>
              </div>
            ))}
          </div>

          <div className="aux-form">
            <input 
              className="aux-input"
              value={nuevoColor} 
              onChange={e => setNuevoColor(e.target.value)} 
              placeholder="Nuevo Color" 
            />
            <button className="btn-add-aux" onClick={() => guardar('color', nuevoColor, setNuevoColor)}>
              +
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GestorAuxiliares;