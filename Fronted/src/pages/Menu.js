import React, { useState, useEffect } from 'react';
import MenuItem from '../components/MenuItem';
import CartItem from '../components/CartItem';
import carritoImage from '../assets/images/carrito.png';
import '../assets/styles/styleMC.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

const Menu = () => {
  const [products, setProducts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false); 
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

  const handleCheckout = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario')); 
  

    if (!usuario || !usuario.id) {
      Swal.fire({
        title: '¡No estás logeado!',
        text: 'Para realizar la compra, necesitas iniciar sesión.',
        icon: 'warning',
        confirmButtonText: 'Ir al Login'
      }).then(() => {
        navigate('/login');
      });
      return; 
    }
  

    if (cartItems.length === 0) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'No tienes productos en el carrito. Por favor, agrega algunos productos antes de proceder.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
      return;
    }
  
   
    const productos = cartItems.map(item => {
      if (!item.id || !item.nombre || !item.precio || item.quantity <= 0) {
        console.error(`Producto con nombre ${item.nombre} tiene datos faltantes o inválidos.`);
        Swal.fire({
          title: 'Producto Inválido',
          text: `El producto "${item.nombre}" tiene datos faltantes o inválidos. Por favor, verifica los detalles del producto.`,
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
        throw new Error(`El producto ${item.nombre} no tiene datos válidos.`);
      }
      return {
        id: item.id,
        name: item.nombre,
        price: parseFloat(item.precio),
        quantity: item.quantity
      };
    });
  
    const total = cartItems.reduce((acc, item) => {
      const itemPrice = item.precio || 0;
      return acc + (itemPrice * item.quantity);
    }, 0).toFixed(2);  
  
    const pedido = {
      cliente: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono || '',
      },
      productos: productos,
      total: total,
      estado: 'Pendiente',
      fechaPedido: new Date().toISOString()
    };
  

    if (!pedido.cliente.id || !pedido.productos.every(p => p.id) || isNaN(pedido.total)) {
      console.error('Pedido no válido:', pedido);
      Swal.fire({
        title: 'Error al procesar el pedido',
        text: 'Uno o más campos obligatorios no están completos o contienen datos incorrectos. Verifica los detalles y vuelve a intentarlo.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
      return;
    }

    console.log('Pedido a enviar:', pedido);
  
    try {
      const responsePedido = await fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });
  
      if (!responsePedido.ok) {
        const errorData = await responsePedido.json();
        console.error('Error al guardar el pedido:', errorData);
        Swal.fire({
          title: 'Error al guardar el pedido',
          text: 'Hubo un problema al guardar tu pedido. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
        return; 
      }
  
      const responsePago = await fetch('http://localhost:8080/api/pago/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productos),
      });
  
      if (responsePago.ok) {
        const paymentUrl = await responsePago.text();
        window.location.href = paymentUrl;
      } else {
        const paymentError = await responsePago.json();
        console.error('Error al crear la preferencia de pago:', paymentError);
        Swal.fire({
          title: 'Error al crear la preferencia de pago',
          text: 'Hubo un problema al procesar tu solicitud de pago. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error al procesar el pago',
        text: 'No se pudo procesar el pago. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.categoria?.nombre || 'Otros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});


  const total = cartItems.reduce((acc, item) => {
    const itemPrice = item.precio || 0;
    return acc + (itemPrice * item.quantity);
  }, 0).toFixed(2);

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
        <p>Total: S/.{total}</p>
        <button onClick={handleCheckout}>Comprar</button>
      </div>
    </div>
  );
};

export default Menu;
