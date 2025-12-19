import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem('cart');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(carrito));
  }, [carrito]);

  // --- MODIFICADO: ACEPTA COLOR ---
  const agregarAlCarrito = (producto, colorSeleccionado = null) => {
    
    // Generamos un ID único temporal para el carrito
    // Si tiene color, el ID es "ID_Producto + Color". Si no, es solo "ID_Producto"
    const cartItemId = colorSeleccionado 
      ? `${producto._id}-${colorSeleccionado}` 
      : producto._id;

    // Buscamos si este ITEM EXACTO ya existe
    const existe = carrito.find(item => item.cartItemId === cartItemId);

    if (existe) {
      const carritoActualizado = carrito.map(item => 
        item.cartItemId === cartItemId ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      setCarrito(carritoActualizado);
    } else {
      // Agregamos el producto con su variante y el ID especial
      setCarrito([...carrito, { 
        ...producto, 
        colorSeleccionado, // Guardamos qué color eligió
        cartItemId,        // Guardamos el ID compuesto
        cantidad: 1 
      }]);
    }
  };

  // --- MODIFICADO: USA cartItemId ---
  const disminuirCantidad = (cartItemId) => {
    const itemEncontrado = carrito.find(item => item.cartItemId === cartItemId);

    if (itemEncontrado.cantidad === 1) {
      setCarrito(carrito.filter(item => item.cartItemId !== cartItemId));
    } else {
      const carritoActualizado = carrito.map(item => 
        item.cartItemId === cartItemId ? { ...item, cantidad: item.cantidad - 1 } : item
      );
      setCarrito(carritoActualizado);
    }
  };

  // --- MODIFICADO: USA cartItemId ---
  const eliminarDelCarrito = (cartItemId) => {
    setCarrito(carrito.filter(item => item.cartItemId !== cartItemId));
  };

  const vaciarCarrito = () => setCarrito([]);

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