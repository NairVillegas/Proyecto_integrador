// src/pages/Pedidos.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Leer usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const nombreUsuario = usuario.nombre || 'desconocido';

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const resp = await fetch('http://localhost:8080/api/pedidos');
        if (!resp.ok) throw new Error('Error al obtener los pedidos.');
        const data = await resp.json();
        setPedidos(data);
      } catch (err) {
        console.error('Error al conectar con la API de pedidos:', err);
        Swal.fire('Error', 'No se pudieron cargar los pedidos.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const handleChangeEstado = async (id) => {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    if (pedido.estado !== 'Pendiente') return;
    try {
      const resp = await fetch(`http://localhost:8080/api/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pedido, estado: 'Finalizado' }),
      });
      if (!resp.ok) throw new Error('Fallo al actualizar estado');
      setPedidos(ps => ps.map(p => p.id === id ? { ...p, estado: 'Finalizado' } : p));
      Swal.fire('Listo', 'Pedido marcado como Finalizado.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo cambiar el estado.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Eliminar este pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    try {
      const resp = await fetch(`http://localhost:8080/api/pedidos/${id}`, {
        method: 'DELETE'
      });
      if (!resp.ok) throw new Error('Fallo al eliminar');
      setPedidos(ps => ps.filter(p => p.id !== id));
      Swal.fire('Eliminado', 'Pedido eliminado correctamente.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar el pedido.', 'error');
    }
  };

  const handleViewDetails = id => {
    navigate(`/pedidos/${id}`);
  };

  // Link para descargar reporte, pasa usuario como query param
  const reporteUrl = `http://localhost:8080/api/documentos/reporte?usuario=${encodeURIComponent(nombreUsuario)}`;

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h2 className="mb-4">Gestión de Pedidos</h2>

      {loading ? (
        <p>Cargando…</p>
      ) : pedidos.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente ID</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.clienteId}</td>
                <td>
                  {p.detallesText
                    ? p.detallesText
                    : <em>No hay productos</em>}
                </td>
                <td>S/ {p.total?.toFixed(2)}</td>
                <td>{p.estado}</td>
                <td>{new Date(p.fechaPedido).toLocaleString()}</td>
                <td className="text-center">
                  <button
                    className="btn btn-info btn-sm me-1"
                    onClick={() => handleViewDetails(p.id)}
                  >
                    Ver
                  </button>
                  <button
                    className="btn btn-primary btn-sm me-1"
                    onClick={() => handleChangeEstado(p.id)}
                    disabled={p.estado !== 'Pendiente'}
                  >
                    Finalizar
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-1"
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </button>
                  <a
                    href={`http://localhost:8080/api/documentos/boleta/${p.id}`}
                    className="btn btn-success btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Boleta
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay pedidos para mostrar.</p>
      )}

      <div className="mt-3">
        <a
          href={reporteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success"
        >
          Descargar Reporte
        </a>
      </div>
    </div>
  );
};

export default Pedidos;
