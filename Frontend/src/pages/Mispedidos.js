// src/pages/MisPedidos.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem('usuario') || '{}')
    if (!usr.id) {
      Swal.fire('Atención', 'No estás identificado', 'warning')
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/pedidos')
        const mine = data.filter(p => p.clienteId === usr.id)
        setPedidos(mine)
      } catch (e) {
        console.error(e)
        Swal.fire('Error', 'No se pudieron cargar tus pedidos', 'error')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleView = id => {
    navigate(`/pedidos/${id}`)
  }

  const handleComplete = async id => {
    try {
      const { data: upd } = await axios.put(
        `http://localhost:8080/api/pedidos/${id}`,
        { estado: 'Finalizado' }
      )
      setPedidos(ps => ps.map(p => p.id === id ? upd : p))
      Swal.fire('Listo', 'Pedido finalizado', 'success')
    } catch (e) {
      console.error(e)
      Swal.fire('Error', 'No se pudo cambiar estado', 'error')
    }
  }

  // Nuevo: en vez de eliminar, cancelamos
  const handleCancel = async pedido => {
    const { value: motivo, isConfirmed } = await Swal.fire({
      title: 'Motivo de cancelación',
      input: 'textarea',
      inputLabel: '¿Por qué cancelas este pedido?',
      showCancelButton: true,
      confirmButtonText: 'Cancelar pedido',
      cancelButtonText: 'No cancelar'
    })
    if (!isConfirmed || !motivo) return

    try {
      const { data: upd } = await axios.put(
        `http://localhost:8080/api/pedidos/${pedido.id}/cancelar`,
        { motivo }
      )
      setPedidos(ps => ps.map(p => p.id === pedido.id ? upd : p))
      Swal.fire('Hecho', 'Pedido cancelado', 'success')
    } catch (e) {
      console.error(e)
      Swal.fire('Error', 'No se pudo cancelar el pedido', 'error')
    }
  }

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h2 className="mb-4">Mis Pedidos</h2>

      {loading ? (
        <p>Cargando…</p>
      ) : pedidos.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Cantidad</th>
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
                <td>{p.producto?.nombre || '–'}</td>
                <td>{p.cantidad}</td>
                <td>S/ {p.total?.toFixed(2)}</td>
                <td>{p.estado}</td>
                <td>{new Date(p.fechaPedido).toLocaleString()}</td>
                <td className="text-center">
               

                  {p.estado === 'Pendiente' && (
                    <>
                     
                      <button
                        className="btn btn-danger btn-sm me-1"
                        onClick={() => handleCancel(p)}
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  <a
                    href={`http://localhost:8080/api/documentos/boleta/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                  >
                    Boleta
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes pedidos aún.</p>
      )}

 
    </div>
  )
}
