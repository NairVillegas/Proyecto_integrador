import React from 'react';
import { useCart } from '../context/CartContext'; // Importa el hook de contexto

const CartSidebar = () => {
    const { isCartVisible } = useCart();

    if (!isCartVisible) return null;

    return (
        <div className={`cart-sidebar ${isCartVisible ? 'open' : ''}`}>
        <h2>Tu Carrito de Compras</h2>
        <ul className="cart-container">
          {cartItems.map(item => (
           <CartItem key={item.id} item={item}
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </ul>
        <p>Total: S/.{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</p>
                <button onClick={() => alert('Proceso de compra iniciado!')}>Comprar</button>
      </div>
    );
};

export default CartSidebar;
