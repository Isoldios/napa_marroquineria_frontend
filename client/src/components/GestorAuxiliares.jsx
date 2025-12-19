import { useState, useEffect } from 'react';
import axios from 'axios';

const GestorAuxiliares = () => {
  // Estados para guardar lo que viene de BD
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Estados para los inputs
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  // URLs (Ajustar si usas Render)
  const API_URL = `${import.meta.env.VITE_API_URL}/auxiliares`; 

  // Cargar datos iniciales
  const cargarDatos = async () => {
    try {
      const resMarcas = await axios.get(`${API_URL}/marcas`);
      const resCategorias = await axios.get(`${API_URL}/categorias`);
      setMarcas(resMarcas.data);
      setCategorias(resCategorias.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Función genérica para guardar
  const guardar = async (tipo) => {
    try {
      if (tipo === 'marca') {
        await axios.post(`${API_URL}/marcas`, { nombre: nuevaMarca });
        setNuevaMarca('');
      } else {
        await axios.post(`${API_URL}/categorias`, { nombre: nuevaCategoria });
        setNuevaCategoria('');
      }
      cargarDatos(); // Recargar listas
    } catch (error) {
      alert('Error al guardar (quizás ya existe)');
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f9f9f9', marginTop: '20px', borderRadius: '8px' }}>
      <h3>Gestión de Marcas y Categorías</h3>
      
      <div style={{ display: 'flex', gap: '50px' }}>
        {/* SECCION MARCAS */}
        <div>
          <h4>Marcas</h4>
          <ul>
            {marcas.map(m => <li key={m._id}>{m.nombre}</li>)}
          </ul>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              value={nuevaMarca} 
              onChange={e => setNuevaMarca(e.target.value)} 
              placeholder="Nueva Marca" 
            />
            <button onClick={() => guardar('marca')}>Agregar</button>
          </div>
        </div>

        {/* SECCION CATEGORIAS */}
        <div>
          <h4>Categorías</h4>
          <ul>
            {categorias.map(c => <li key={c._id}>{c.nombre}</li>)}
          </ul>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              value={nuevaCategoria} 
              onChange={e => setNuevaCategoria(e.target.value)} 
              placeholder="Nueva Categoría" 
            />
            <button onClick={() => guardar('categoria')}>Agregar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestorAuxiliares;