// src/components/CheckoutButton.jsx
import React, { useState } from "react";
import { getStripe } from "../utils/stripe";

export default function CheckoutButton({ amount, description }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // 1️⃣ Llamada a tu backend para crear la sesión
      const res = await fetch("http://localhost:8080/api/pagos/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,            // en centavos, p.ej. 1500
          description,       // texto que verá el cliente
          successUrl: window.location.origin + "/success",
          cancelUrl:  window.location.origin + "/cancel"
        }),
      });

      const { sessionId, publishableKey } = await res.json();

      // 2️⃣ Inicializa Stripe.js con tu public key
      const stripe = await getStripe(publishableKey);

      // 3️⃣ Redirige al Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Stripe error:", error);
        alert(error.message);
      }
    } catch (err) {
      console.error("Error creando sesión de Stripe:", err);
      alert("No se pudo iniciar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? "Cargando..." : `Pagar S/ ${(amount/100).toFixed(2)}`}
    </button>
  );
}
