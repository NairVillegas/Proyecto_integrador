// src/pages/PaymentPage.js
import React from "react";
import CheckoutButton from "../components/CheckoutButton";
import { useCart } from "../context/CartContext";

export default function PaymentPage() {
  const { cartItems, clienteId } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Confirma tu pago</h1>
      <p>Total a pagar: S/. {total.toFixed(2)}</p>

      <CheckoutButton
        cartItems={cartItems}
        total={total}
        clienteId={clienteId}
      />
    </div>
  );
}
