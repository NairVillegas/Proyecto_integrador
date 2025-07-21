// src/components/CheckoutButton.jsx
import React, { useState } from "react";
import { getStripe } from "../utils/stripe";
import api from "../services/api";      // Axios/fetch ya preconfigurado

export default function CheckoutButton({ cartItems, total, clienteId }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!clienteId) {
      alert("Debes iniciar sesión antes de pagar.");
      return;
    }
    setLoading(true);

    try {
      // 1️⃣ Creamos el Pedido en nuestra BD
      const payload = {
        cliente: { id: clienteId },
        estado: "Pendiente",
        detalle: cartItems.map(item => ({
          producto: { id: item.producto.id },
          cantidad: item.quantity
        }))
      };
      const { data: nuevoPedido } = await api.post("http://localhost:8080/api/pedidos", payload);

      // 2️⃣ Creamos la sesión de Stripe usando sólo el pedidoId
      const stripeReq = {
        amount: Math.round(total * 100),
        description: `Pedido #${nuevoPedido.id}`,
        successUrl: window.location.origin + "/success?pedidoId=" + nuevoPedido.id,
        cancelUrl: window.location.origin + "/cancel",
        // enviamos metadata al webhook si lo necesitas:
        metadata: { pedido_id: nuevoPedido.id }
      };
      const { data: session } = await api.post("http://localhost:8080/api/pagos/create-session", stripeReq);

      // 3️⃣ Redirigimos a Stripe.js
      const stripe = await getStripe(session.publishableKey);
      const { error } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
      if (error) throw error;

      // 4️⃣ Opcional: limpiamos el carrito
      // clearCart(); <— si lo expones desde contexto

    } catch (err) {
      console.error("Error iniciando pago:", err);
      alert("No se pudo iniciar el pago.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || cartItems.length === 0}
      style={{ padding: "0.5rem 1rem" }}
    >
      {loading ? "Redirigiendo…" : `Pagar S/ ${total.toFixed(2)}`}
    </button>
  );
}
