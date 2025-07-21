import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cartItems.map((item) => (
        <div key={item.id}>
          {item.nombre} – Cantidad: {item.quantity} – Precio: S/. {item.precio}
          <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
        </div>
      ))}
      <h3>Total: S/. {total.toFixed(2)}</h3>
      <Link to="/pago">Ir a Pagar</Link>
    </div>
  );
}
