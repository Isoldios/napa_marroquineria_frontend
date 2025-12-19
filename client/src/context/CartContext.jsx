// client/src/context/CartContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// 2. Crear el Hook personalizado para usarlo fácil
export const useCart = () => useContext(CartContext);

// 3. Crear el Proveedor (El componente que envolverá tu App)
export const CartProvider = ({ children }) => {
  // Inicializamos el carrito buscando en LocalStorage (para no perder datos si recarga)
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem('cart');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
      return [];
    }
  });

  // Cada vez que cambie el carrito, guardamos en LocalStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(carrito));
  }, [carrito]);

  // Función: Agregar al carrito
  const agregarAlCarrito = (producto) => {
    // Verificamos si ya está en el carrito para aumentar cantidad
    const existe = carrito.find(item => item._id === producto._id);

    if (existe) {
      // Si existe, actualizamos su cantidad
      const carritoActualizado = carrito.map(item => 
        item._id === producto._id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      setCarrito(carritoActualizado);
    } else {
      // Si no existe, lo agregamos con cantidad 1
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const disminuirCantidad = (id) => {
  const itemEncontrado = carrito.find(item => item._id === id);

  // Si solo queda 1, lo eliminamos del todo
  if (itemEncontrado.cantidad === 1) {
    setCarrito(carrito.filter(item => item._id !== id));
  } else {
    // Si hay más de 1, restamos una unidad
    const carritoActualizado = carrito.map(item => 
      item._id === id ? { ...item, cantidad: item.cantidad - 1 } : item
    );
    setCarrito(carritoActualizado);
  }
};

  // Función: Eliminar del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item._id !== id));
  };

  // Función: Vaciar carrito (para cuando compre)
  const vaciarCarrito = () => setCarrito([]);

  // Calcular total
  const totalCompra = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ 
      carrito, 
      agregarAlCarrito,
      disminuirCantidad,
      eliminarDelCarrito, 
      vaciarCarrito, 
      totalCompra,
      cantidadTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};