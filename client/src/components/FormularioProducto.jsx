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
    descripcion: '',
    imagen: '',
    stock: '', // Stock simple
    tieneColores: false, // Switch
    stockPorColor: [] // Array de objetos { nombre: 'Rojo', cantidad: 10 }
  });

  const [subiendo, setSubiendo] = useState(false); // Para mostrar "Cargando..."
  // NUEVOS ESTADOS PARA LAS LISTAS DESPLEGABLES
  const [listaMarcas, setListaMarcas] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [listaColores, setListaColores] = useState([]);

  const [varianteTemp, setVarianteTemp] = useState({ colorSeleccionado: '', cantidad: '' });

  const API_URL = `${import.meta.env.VITE_API_URL}/auxiliares`;

  useEffect(() => {
    const cargarListas = async () => {
      try {
        const [resM, resCat, resCol] = await Promise.all([
          axios.get(`${API_URL}/marcas`),
          axios.get(`${API_URL}/categorias`),
          axios.get(`${API_URL}/colores`)
        ]);
        setListaMarcas(resM.data);
        setListaCategorias(resCat.data);
        setListaColores(resCol.data);
      } catch (error) { console.error("Error cargando listas", error); }
    };
    cargarListas();
  }, []);

  useEffect(() => {
    if (productoEditar) {
      setFormData({
        ...productoEditar,
        stockPorColor: productoEditar.stockPorColor || []
      });
    }
  }, [productoEditar]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const agregarVariante = () => {
    if (!varianteTemp.colorSeleccionado || !varianteTemp.cantidad) return alert("Elige color y cantidad");
    
    // Evitar duplicados (ej: agregar Rojo dos veces)
    const existe = formData.stockPorColor.find(item => item.nombre === varianteTemp.colorSeleccionado);
    if (existe) return alert("Ese color ya está en la lista. Bórralo y agrégalo de nuevo si quieres cambiarlo.");

    const nuevaVariante = {
      nombre: varianteTemp.colorSeleccionado,
      cantidad: Number(varianteTemp.cantidad)
    };

    setFormData({
      ...formData,
      stockPorColor: [...formData.stockPorColor, nuevaVariante]
    });
    
    // Limpiar inputs temporales
    setVarianteTemp({ colorSeleccionado: '', cantidad: '' });
  };

  const eliminarVariante = (nombreColor) => {
    setFormData({
      ...formData,
      stockPorColor: formData.stockPorColor.filter(item => item.nombre !== nombreColor)
    });
  };

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
    if (formData.tieneColores && formData.stockPorColor.length === 0) {
      return alert("Activaste 'Tiene Colores' pero no agregaste ninguno.");
    }
    alGuardar(formData);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>{productoEditar ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
          
          <select name="marca" value={formData.marca} onChange={handleChange} required>
            <option value="">-- Marca --</option>
            {listaMarcas.map(m => <option key={m._id} value={m.nombre}>{m.nombre}</option>)}
          </select>

          <select name="categoria" value={formData.categoria} onChange={handleChange} required>
            <option value="">-- Categoría --</option>
            {listaCategorias.map(c => <option key={c._id} value={c.nombre}>{c.nombre}</option>)}
          </select>

          <input type="number" name="precio" placeholder="Precio" value={formData.precio} onChange={handleChange} required />
          
          <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} required />

          {/* --- SECCION DE STOCK INTELIGENTE --- */}
          <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', background: '#f9f9f9' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', marginBottom: '10px' }}>
              <input 
                type="checkbox" 
                name="tieneColores" 
                checked={formData.tieneColores} 
                onChange={handleChange} 
              />
              ¿Este producto tiene variantes de color?
            </label>

            {!formData.tieneColores ? (
              // CASO A: STOCK SIMPLE
              <input 
                type="number" 
                name="stock" 
                placeholder="Cantidad de Stock Total" 
                value={formData.stock} 
                onChange={handleChange} 
                required={!formData.tieneColores} // Solo requerido si NO tiene colores
              />
            ) : (
              // CASO B: STOCK POR COLORES
              <div>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Agrega el stock disponible por cada color:</p>
                
                {/* Inputs para agregar nueva variante */}
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                  <select 
                    value={varianteTemp.colorSeleccionado}
                    onChange={e => setVarianteTemp({ ...varianteTemp, colorSeleccionado: e.target.value })}
                    style={{ flex: 1 }}
                  >
                    <option value="">- Elegir Color -</option>
                    {listaColores.map(c => <option key={c._id} value={c.nombre}>{c.nombre}</option>)}
                  </select>
                  
                  <input 
                    type="number" 
                    placeholder="Cant." 
                    style={{ width: '70px' }}
                    value={varianteTemp.cantidad}
                    onChange={e => setVarianteTemp({ ...varianteTemp, cantidad: e.target.value })}
                  />
                  
                  <button type="button" onClick={agregarVariante} style={{ background: '#28a745', color: 'white', border: 'none' }}>+</button>
                </div>

                {/* Lista de variantes agregadas */}
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {formData.stockPorColor.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px', borderBottom: '1px solid #eee' }}>
                      <span>{item.nombre} - <strong>{item.cantidad} u.</strong></span>
                      <button 
                        type="button" 
                        onClick={() => eliminarVariante(item.nombre)}
                        style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
                
                {/* Calculadora visual del total */}
                <div style={{ textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '5px' }}>
                   Stock Total Calculado: {formData.stockPorColor.reduce((acc, it) => acc + Number(it.cantidad), 0)}
                </div>
              </div>
            )}
          </div>

          <label style={{fontWeight: 'bold', fontSize: '14px', marginTop: '10px'}}>Imagen:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          {subiendo && <p>Subiendo...</p>}
          {formData.imagen && <img src={formData.imagen} alt="Vista previa" style={{ width: '80px', height: '80px', objectFit: 'cover', margin: '0 auto' }} />}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button type="button" onClick={cerrarFormulario} style={{ background: '#ccc', border: 'none', padding: '10px' }}>Cancelar</button>
            <button type="submit" disabled={subiendo} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px' }}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioProducto;