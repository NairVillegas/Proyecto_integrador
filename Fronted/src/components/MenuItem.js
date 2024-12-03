import React from 'react';

const MenuItem = ({ product, addToCart }) => {
  const productName = product.nombre?.toLowerCase().replace(/\s+/g, '-');

  let imagePath;
  try {
    imagePath = require(`../assets/images/${productName}.png`);
  } catch (error) {
    imagePath = require(`../assets/images/default-image.png`); 
  }

  return (
    <div className="menu-card">
      <img src={imagePath.default || imagePath} alt={product.nombre} className="product-image" />
      <div className="product-details">
        <h3>{product.nombre}</h3>
        <p>s/.{product.precio ? product.precio.toFixed(2) : '0.00'}</p>  
        <button onClick={() => addToCart(product)}>Añadir al Carrito</button> 
      </div>
    </div>
  );
};

export default MenuItem;
