// src/components/PayCartButton.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import CheckoutButton from "./CheckoutButton";

export default function PayCartButton({ total, saveOrder }) {
  const [ready, setReady] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // 1. Cuando pulsemos, guardamos el pedido primero
  const handleClick = async () => {
    try {
      const saved = await saveOrder(); // esto devuelve el pedido guardado
      setOrderId(saved.id);            // si quieres usarlo luego
      setReady(true);                  // marca que ya podemos mostrar el CheckoutButton
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // 2. Si ya guardamos (ready === true), renderizamos el CheckoutButton
  if (ready) {
    return (
      <CheckoutButton
        amount={Math.round(total * 100)}
        description={`Pago carrito — S/ ${total.toFixed(2)}`}
      />
    );
  }

  // 3. Si no estamos listos, mostramos el botón normal
  return (
    <button onClick={handleClick}>
      Pagar
    </button>
  );
}
