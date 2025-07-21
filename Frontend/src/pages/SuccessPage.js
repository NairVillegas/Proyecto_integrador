// src/pages/SuccessPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../assets/styles/success.css'; // tu estilo bonito

export default function SuccessPage() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const pedidoId = query.get('pedidoId');
  const [pedidoInfo, setPedidoInfo] = useState(null);

  useEffect(() => {
    if (!pedidoId) {
      Swal.fire('Error', 'No se encontró el ID del pedido en la URL', 'error');
      return;
    }

    fetch(`http://localhost:8080/api/pedidos/${pedidoId}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo obtener el pedido');
        return res.json();
      })
      .then(data => setPedidoInfo(data))
      .catch(err => {
        console.error(err);
        Swal.fire('Error', err.message, 'error');
      });
  }, [pedidoId]);

  return (
    <div className="success-page">
      <div className="container">
        <div className="success-icon">✔️</div>
        <h1>¡Pago Exitoso!</h1>
        <p>Gracias por tu compra. Tu pago ha sido procesado correctamente.</p>

        {pedidoInfo && (
          <div className="pedido-summary">
            <p><strong>Pedido ID:</strong> {pedidoInfo.id}</p>
            <p><strong>Total:</strong> S/ {pedidoInfo.total.toFixed(2)}</p>
            <p><strong>Fecha:</strong> {new Date(pedidoInfo.fechaPedido).toLocaleString()}</p>
          </div>
        )}

        <Link to="/" className="btn">Seguir Comprando</Link>
      </div>
    </div>
  );
}
