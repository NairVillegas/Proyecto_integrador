import React, { useState, useEffect } from 'react';
import MenuItem from '../components/MenuItem';
import CartItem from '../components/CartItem';
import carritoImage from '../assets/images/carrito.png';
import '../assets/styles/styleMC.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getStripe } from '../utils/stripe';


const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categorias');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Error al obtener las categorías.');
        }
      } catch (error) {
        console.error('Error al conectar con la API de categorías:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Error al obtener los productos.');
        }
      } catch (error) {
        console.error('Error al conectar con la API de productos:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const getImageUrl = (productName) => {
    if (!productName) return '/assets/images/default-image.png';

    const formattedName = productName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[áéíóú]/g, (match) => ({ 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' })[match]);

    return `/assets/images/${formattedName}.png`;
  };

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
        return { ...item, quantity: item.quantity + amount };
      }
      return item;
    }));
  };

  const handleClearCartClick = () => {
    setShowConfirmModal(true); // Mostrar modal de confirmación
  };

  const confirmClearCart = () => {
    setCartItems([]); // Vaciar carrito
    setShowConfirmModal(false); // Ocultar modal
  };

 const handleCheckout = async () => {
  // 1️⃣ Validaciones
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario?.id) {
    await Swal.fire({
      title: "¡No estás logeado!",
      text: "Para realizar la compra necesitas iniciar sesión.",
      icon: "warning",
      confirmButtonText: "Ir al Login"
    });
    return navigate("/login");
  }
  if (cartItems.length === 0) {
    return Swal.fire({
      title: "Carrito vacío",
      text: "No tienes productos en el carrito.",
      icon: "error",
      confirmButtonText: "Cerrar"
    });
  }

  // 2️⃣ Crear sesión de Stripe con clienteId incluido
  try {
    const res = await fetch("http://localhost:8080/api/pagos/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId: usuario.id,                        // ← Añadido aquí
        amount: Math.round(total * 100),
        description: `Pago carrito — S/ ${total}`,
        successUrl: window.location.origin + "/success",
        cancelUrl:  window.location.origin + "/cancel"
      })
    });
    if (!res.ok) throw new Error("No se pudo iniciar el pago");

    // 3️⃣ Recibimos sessionId, publishableKey y pedidoId
    const { sessionId, publishableKey, pedidoId } = await res.json();

    // 4️⃣ Redirigimos a Stripe Checkout
    const stripe = await getStripe(publishableKey);
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) throw error;

  } catch (err) {
    console.error("Stripe error:", err);
    Swal.fire("Error", err.message, "error");
  }
};

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.categoria?.nombre || 'Otros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const total = cartItems.reduce((acc, item) => acc + (item.precio * item.quantity), 0).toFixed(2);

  return (
    <div className="menu-container">
      <div className="menu-navbar">
        {Object.keys(groupedProducts).map((category) => (
          <a href={`#${category}`} key={category}>{category}</a>
        ))}
        <img
          src={carritoImage}
          alt="Carrito"
          className="toggle-cart-button"
          onClick={toggleCartVisibility}
          style={{ cursor: 'pointer', width: '50px', height: '50px' }}
        />
      </div>

      {Object.entries(groupedProducts).map(([category, items]) => (
        <div id={category} key={category} className="category-container">
          <h2 className="category-title">{category}</h2>
          <div className="product-grid">
            {items.map(product => (
              <MenuItem
                key={product.id}
                product={product}
                addToCart={() => addToCart(product)}
                imageUrl={getImageUrl(product.nombre)}
              />
            ))}
          </div>
        </div>
      ))}

      {showConfirmModal && (
        <div className="confirm-modal">
          <p>¿Estás seguro de que deseas vaciar el carrito?</p>
          <button onClick={confirmClearCart}>Sí</button>
          <button onClick={() => setShowConfirmModal(false)}>No</button>
        </div>
      )}

      <div className={`cart-sidebar ${isCartVisible ? 'open' : ''}`}>
        <h2>Tu Carrito de Compras</h2>
        <ul className="cart-container">
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </ul>
        <p>Total: S/.{total}</p>
        <button onClick={handleCheckout}>Comprar</button>
        <button onClick={handleClearCartClick} className="clear-cart-button">Eliminar Todo</button>
        <button className="close-cart-button" onClick={toggleCartVisibility}>Cerrar Carrito</button>
      </div>
    </div>
  );
};

export default Menu;
