import React from 'react';
import flamaBrava from '../assets/images/flama-brava.jpg';
import pollo from '../assets/images/polloentero.png';
import parrilla from '../assets/images/parrillafamiliar.png';
import alitasBBQ from '../assets/images/alitasbbq.png';
import alitas from '../assets/images/alitas.jpg';
import anticucho from '../assets/images/anticucho.png';
import Parrillas from '../assets/images/parrillafamiliar.png';
import cuartodepollo from '../assets/images/cuartodepollo.png';


const MenuItem = ({ product, addToCart }) => {
  // Construir la ruta de la imagen directamente usando el nombre del archivo desde la lista de productos
  const imagePath = require(`../assets/images/${product.image}`);

  return (
    <div className="menu-card">
      <img src={imagePath.default || imagePath} alt={product.name} className="product-image" />
      <div className="product-details">
        <h3>{product.name}</h3>
        <p>s/.{product.price.toFixed(2)}</p>
        <button onClick={addToCart}>Añadir al Carrito</button>
      </div>
    </div>
  );
};

export default MenuItem;