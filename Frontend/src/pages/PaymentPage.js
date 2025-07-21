import React from "react";
import CheckoutButton from "../components/CheckoutButton";
import { useCart } from "../context/CartContext";

export default function PaymentPage() {
  const { cartItems } = useCart();

  // Calcula el total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Confirma tu pago</h1>
      <p>Total a pagar: S/. {total.toFixed(2)}</p>
      <CheckoutButton
        amount={Math.round(total * 100)}
        description={`Pago carrito — S/ ${total.toFixed(2)}`}
      />
    </div>
  );
}
