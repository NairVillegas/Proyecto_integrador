import React, { useState } from 'react';
import MenuItem from '../components/MenuItem';
import CartItem from '../components/CartItem';
import flamaBrava from '../assets/images/flama-brava.jpg';
import pollo from '../assets/images/polloentero.png';
import parrillafamiliar  from '../assets/images/parrillafamiliar.png';
import alitasBBQ from '../assets/images/alitasbbq.png';
import alitas from '../assets/images/alitas.jpg';
import Anticuchos from '../assets/images/anticucho.png';
import Parrillas from '../assets/images/parrillafamiliar.png';
import Cuartodepollo from '../assets/images/cuartodepollo.png';
import Limonada from '../assets/images/limonada.png';
import mediopollo from '../assets/images/mediopollo.png';
import mediacostillabbq from '../assets/images/mediacostillabbq.png';
import chichas from '../assets/images/chicha.png';
import inka500 from '../assets/images/inkacola.png';
import coca500 from '../assets/images/cocacola.png';
import maracuya from '../assets/images/maracuya.png';
import aguasanluis from '../assets/images/aguasanluis.png';
import tequeños from '../assets/images/tequeños.png';
import salchipapa from '../assets/images/salchipapa.png';
import carritoImage from '../assets/images/carrito.png';
import '../assets/styles/styleMC.css';
import { useNavigate } from 'react-router-dom';


const Menu = () => {
  const [products] = useState([
    { id: 1, name: 'Pollo Entero', price: 55.00, image: 'polloentero.png', category: 'Clásicos', description: 'Pollo jugoso a la brasa con especias selectas.' },
    { id: 2, name: 'Anticucho', price: 25.00, image: 'anticucho.png', category: 'Piqueos', description: 'Brochetas de corazón de res marinadas en ají panca.' },
    { id: 3, name: 'Parrilla Familiar', price: 45.00, image: 'parrillafamiliar.png', category: 'Parrillas', description: 'Variedad de carnes a la parrilla incluyendo pollo, res y cerdo.' },
    { id: 4, name: 'Alitas BBQ', price: 32.00, image: 'alitasbbq.png', category: 'Parrillas', description: 'Alitas de pollo bañadas en salsa BBQ.' },
    { id: 5, name: 'Cuarto de Pollo', price: 18.00, image: 'cuartodepollo.png', category: 'Clásicos', description: 'Cuarto de pollo asado con guarniciones.' },
    { id: 6, name: 'Limonada', price: 10.00, image: 'limonada.png', category: 'Bebidas', description: 'Limonada natural refrescante.' },
    { id: 7, name: 'Medio Pollo', price: 76.00, image: 'mediopollo.png', category: 'Clásicos', description: 'Medio pollo asado perfecto para compartir.' },
    { id: 8, name: 'Media Costilla BBQ', price: 35.00, image: 'mediacostillabbq.png', category: 'Parrillas', description: 'Costillas de cerdo a la BBQ.' },
    { id: 9, name: 'Chicha', price: 8.00, image: 'chicha.png', category: 'Bebidas', description: 'Chicha morada tradicional peruana.' },
    { id: 10, name: 'Inka Cola', price: 5.00, image: 'inkacola.png', category: 'Bebidas', description: 'Bebida gaseosa de sabor único y nacional.' },
    { id: 11, name: 'Coca Cola', price: 5.00, image: 'cocacola.png', category: 'Bebidas', description: 'Clásica bebida refrescante.' },
    { id: 12, name: 'Maracuya', price: 12.00, image: 'maracuya.png', category: 'Bebidas', description: 'Jugo natural de maracuyá.' },
    { id: 13, name: 'Agua San Luis', price: 3.00, image: 'aguasanluis.png', category: 'Bebidas', description: 'Agua mineral natural.' },
    { id: 14, name: 'Tequeños', price: 15.00, image: 'tequeños.png', category: 'Piqueos', description: 'Deditos de queso envueltos en masa crujiente.' },
    { id: 15, name: 'Salchipapa', price: 20.00, image: 'salchipapa.png', category: 'Piqueos', description: 'Papas fritas con trozos de salchicha caliente.' }
  ]);

  
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const addToCart = (product) => {
    const exists = cartItems.find(item => item.id === product.id);
    if (exists) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, amount) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        return {...item, quantity: item.quantity + amount};
      }
      return item;
    }));
  };

  
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/payment'); // Redirige a la página de pago
    } else {
      alert('El carrito está vacío. Agrega productos antes de proceder.');
    }
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const clearCart = () => {
    setCartItems([]);  // Esto vaciará el carrito
  };
  const [showConfirmModal, setShowConfirmModal] = useState(false);  // Estado para controlar la visibilidad del modal
  const handleClearCartClick = () => {
    setShowConfirmModal(true);  // Muestra el modal de confirmación
  };
  
  // Agrupar productos por categorías
  const categories = products.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="menu-container">
      <div className="menu-navbar">
        {Object.keys(categories).map((category) => (
          <a href={`#${category}`} key={category}>{category}</a>
          
        ))}
        {showConfirmModal && (
  <div className="confirm-modal">
    <p>¿Estás seguro de que deseas eliminar todos los artículos del carrito?</p>
    <button onClick={() => {
      setCartItems([]);  // Vacía el carrito
      setShowConfirmModal(false);  // Oculta el modal
    }}>Sí</button>
    <button onClick={() => setShowConfirmModal(false)}>No</button>
  </div>
)}

        <img
          src={carritoImage}
          alt="Carrito"
          className="toggle-cart-button"
          onClick={toggleCartVisibility}
          style={{ cursor: 'pointer', width: '50px', height: '50px' }} // Establece el tamaño según tus necesidades
        />
      </div>
      {Object.entries(categories).map(([category, items]) => (
        <div id={category} key={category} className="category-container">
          <h2 className="category-title">{category}</h2>
          <div className="product-grid">
            {items.map(product => (
              <MenuItem key={product.id} product={product} addToCart={() => addToCart(product)} />
            ))}
          </div>
        </div>
      ))}
      
<div className={`cart-sidebar ${isCartVisible ? 'open' : ''}`}>
  <h2>Tu Carrito de Compras</h2>
  <ul className="cart-container">
    {cartItems.map(item => (
      <CartItem key={item.id} item={item}
        onRemove={handleRemove}
        onQuantityChange={handleQuantityChange}
      />
    ))}
  </ul>
  <p>Total: S/.{total.toFixed(2)}</p>

  <button onClick={handleCheckout}>Comprar</button>
  <button onClick={handleClearCartClick} className="clear-cart-button">Eliminar Todo</button>

</div>
    </div>
  );
};

export default Menu;
