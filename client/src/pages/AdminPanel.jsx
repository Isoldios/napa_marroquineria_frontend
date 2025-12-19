import { useEffect, useState } from 'react';
import axios from 'axios';
import FormularioProducto from '../components/FormularioProducto';
import GestorAuxiliares from '../components/GestorAuxiliares';

const AdminPanel = () => {
  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/productos`; 

  const obtenerProductos = async () => {
    try {
      const respuesta = await axios.get(API_URL);
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Seguro deseas eliminar?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        obtenerProductos();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  // Función para manejar el GUARDADO (Crear o Editar)
  const guardarProducto = async (datos) => {
    try {
      if (productoAEditar) {
        // MODO EDICIÓN (PUT)
        await axios.put(`${API_URL}/${productoAEditar._id}`, datos);
        alert('Producto actualizado');
      } else {
        // MODO CREACIÓN (POST)
        await axios.post(API_URL, datos);
        alert('Producto creado');
      }
      
      setMostrarFormulario(false);
      setProductoAEditar(null);
      obtenerProductos(); // Recargar tabla
    } catch (error) {
      console.error("Error al guardar:", error);
      alert('Hubo un error al guardar');
    }
  };

  // Funciones auxiliares para abrir/cerrar modal
  const abrirParaCrear = () => {
    setProductoAEditar(null);
    setMostrarFormulario(true);
  };

  const abrirParaEditar = (producto) => {
    setProductoAEditar(producto);
    setMostrarFormulario(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Administración</h1>
      
      <button 
        onClick={abrirParaCrear}
        style={{ marginBottom: '20px', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        + Agregar Nuevo Producto
      </button>

      {/* Renderizado condicional del Modal */}
      {mostrarFormulario && (
        <FormularioProducto 
          productoEditar={productoAEditar}
          cerrarFormulario={() => setMostrarFormulario(false)}
          alGuardar={guardarProducto}
        />
      )}

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod._id}>
              <td>{prod.nombre}</td>
              <td>{prod.marca}</td>
              <td>${prod.precio}</td>
              <td>{prod.stock}</td>
              <td>
                <button 
                  onClick={() => eliminarProducto(prod._id)}
                  style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', marginRight: '5px' }}
                >
                  Eliminar
                </button>
                <button 
                  onClick={() => abrirParaEditar(prod)}
                  style={{ background: '#ffc107', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <GestorAuxiliares />
    </div>
  );
};

export default AdminPanel;