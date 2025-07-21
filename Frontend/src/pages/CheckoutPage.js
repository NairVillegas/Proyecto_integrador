import React from "react";
import CheckoutButton from "../components/CheckoutButton";

export default function CheckoutPage() {
  const amount = 1500;            // o pásalo como prop/state
  const description = "Pedido #123";

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Pagar tu pedido</h1>
      <p>Monto a pagar: S/ {(amount / 100).toFixed(2)}</p>
      <CheckoutButton amount={amount} description={description} />
    </div>
  );
}
