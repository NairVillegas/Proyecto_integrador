// src/context/CartContext.js
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setCartVisible] = useState(false);

  const addToCart = item => setCartItems(prev => [...prev, item]);
  const removeFromCart = id =>
    id == null ? setCartItems([]) : setCartItems(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id, qty) =>
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartVisible,
      setCartVisible,
      addToCart,
      removeFromCart,
      updateQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
}

// **Este** hook es el que debes importar en tus componentes
export function useCart() {
  // Esto arrojará error si no envolviste tu App con <CartProvider>
  return useContext(CartContext);
}
