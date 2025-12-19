// client/src/components/FormularioProducto.jsx
import { useState, useEffect } from 'react';
// Importamos funciones de Firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase'; // Importamos nuestra config
import axios from 'axios';

const FormularioProducto = ({ productoEditar, cerrarFormulario, alGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    categoria: '',
    precio: '',
    stock: '',
    descripcion: '',
    imagen: ''
  });

  const [subiendo, setSubiendo] = useState(false); // Para mostrar "Cargando..."
  // NUEVOS ESTADOS PARA LAS LISTAS DESPLEGABLES
  const [listaMarcas, setListaMarcas] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);

  const API_AUXILIARES = `${import.meta.env.VITE_API_URL}/auxiliares`;

  useEffect(() => {
    const cargarListas = async () => {
      try {
        const resMarcas = await axios.get(`${API_AUXILIARES}/marcas`);
        const resCat = await axios.get(`${API_AUXILIARES}/categorias`);
        setListaMarcas(resMarcas.data);
        setListaCategorias(resCat.data);
      } catch (error) {
        console.error("Error cargando listas");
      }
    };
    cargarListas();
  }, []);

  useEffect(() => {
    if (productoEditar) {
      setFormData(productoEditar);
    }
  }, [productoEditar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---> NUEVA FUNCIÓN: MANEJAR SUBIDA DE ARCHIVO
  const handleFileChange = async (e) => {
    const archivo = e.target.files[0];

    if (archivo) {
      try {
        setSubiendo(true);
        // 1. Crear una referencia (dónde se guardará en Firebase)
        // Usamos Date.now() para que el nombre sea único y no se sobrescriba
        const storageRef = ref(storage, `productos/${Date.now()}-${archivo.name}`);
        
        // 2. Subir el archivo
        await uploadBytes(storageRef, archivo);
        
        // 3. Obtener la URL pública para descargarla
        const urlImagen = await getDownloadURL(storageRef);
        
        // 4. Guardar esa URL en nuestro estado del formulario
        setFormData(prev => ({ ...prev, imagen: urlImagen }));
        
        console.log("Imagen subida:", urlImagen);
      } catch (error) {
        console.error("Error al subir imagen:", error);
        alert("Error al subir la imagen");
      } finally {
        setSubiendo(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alGuardar(formData);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>{productoEditar ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
          <label>Marca:</label>
          <select name="marca" value={formData.marca} onChange={handleChange} required>
            <option value="">-- Seleccionar Marca --</option>
            {listaMarcas.map(m => (
              <option key={m._id} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>
          <label>Categoría:</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange} required>
            <option value="">-- Seleccionar Categoría --</option>
            {listaCategorias.map(c => (
              <option key={c._id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
          <input type="number" name="precio" placeholder="Precio" value={formData.precio} onChange={handleChange} required />
          <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
          <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} required />
          
          {/* INPUT DE ARCHIVO (REEMPLAZA AL TEXTO MANUAL) */}
          <label style={{fontWeight: 'bold', fontSize: '14px'}}>Imagen del producto:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          
          {subiendo && <p style={{color: 'blue'}}>Subiendo imagen a la nube...</p>}
          
          {/* Previsualización de la imagen si ya existe */}
          {formData.imagen && (
            <img src={formData.imagen} alt="Vista previa" style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 auto' }} />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button type="button" onClick={cerrarFormulario} style={{ background: '#ccc', border: 'none', padding: '10px', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={subiendo} // Deshabilitar botón si está subiendo foto
              style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', opacity: subiendo ? 0.5 : 1 }}
            >
              {productoEditar ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioProducto;