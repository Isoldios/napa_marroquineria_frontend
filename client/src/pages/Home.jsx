// client/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [productos, setProductos] = useState([]);

  // useEffect se ejecuta cuando la página carga
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        // Petición al backend
        const respuesta = await axios.get('http://localhost:4000/api/productos');
        setProductos(respuesta.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Napa Marroquinería</h1>
      <h2>Catálogo de Productos</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {productos.map((producto) => (
          <div key={producto._id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
            {/* Aquí iría la imagen <img src={producto.imagen} ... /> */}
            <h3>{producto.nombre}</h3>
            <p>Marca: {producto.marca}</p>
            <p>Precio: ${producto.precio}</p>
            <button>Agregar al Carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;