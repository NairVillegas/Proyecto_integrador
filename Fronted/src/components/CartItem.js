import React, { useState, useEffect } from 'react';
import flamaBrava from '../assets/images/flama-brava.jpg';

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const imageName = item.name.replace(/\s+/g, '').toLowerCase();
    const imagePath = require(`../assets/images/${imageName}.png`);
    setImageSrc(imagePath);
  }, [item.name]);

  return (
    <li className="cart-card">
      <img src={imageSrc} alt={item.name} className="cart-image" />
      <div className="cart-info">
        <div>
          {item.name} - s/.{item.price.toFixed(2)} x {item.quantity}
        </div>
        <div className="button-cart">
          <button  onClick={() => onQuantityChange(item.id, 1)}>+</button>
          <button  onClick={() => onQuantityChange(item.id, -1)} disabled={item.quantity <= 1}>-</button>
          <button  onClick={() => onRemove(item.id)}>x</button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
