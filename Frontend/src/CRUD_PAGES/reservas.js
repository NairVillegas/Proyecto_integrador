// src/components/ReservaCrud.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

const ReservaCrud = () => {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)

  // 1) Cargar reservas al montar
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/reservas')
        setReservas(data)
      } catch (error) {
        console.error('Error al obtener las reservas:', error)
        Swal.fire('Error', 'No se pudieron cargar las reservas.', 'error')
      } finally {
        setCargando(false)
      }
    }
    fetchReservas()
  }, [])

  // 2) Cancelar reserva (marcar como "Cancelado")
  const handleCancel = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Seguro que quieres cancelar?',
      text: 'La reserva pasará a estado "Cancelado".',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
    })

    if (!isConfirmed) return

    try {
      const { data: reservaActualizada } = await axios.put(
        `http://localhost:8080/api/reservas/${id}/cancelar`
      )
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? reservaActualizada : r))
      )
      Swal.fire('Hecho', 'Reserva cancelada correctamente.', 'success')
    } catch (err) {
      console.error('Error al cancelar la reserva:', err)
      Swal.fire('Error', 'No se pudo cancelar la reserva.', 'error')
    }
  }

  // 3) Parsear fecha que puede venir como ISO‐string o como array [yyyy,mm,dd,h,min]
  const parseFecha = (f) => {
    if (Array.isArray(f)) {
      const [y, m, d, h, min] = f
      return new Date(y, m - 1, d, h, min)
    }
    return new Date(f)
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Lista de Reservas</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            {[
              'Nombre',
              'Apellido',
              'Teléfono',
              'Correo',
              'Mesa',
              'Personas',
              'Observaciones',
              'Inicio',
              'Fin',
              'Estado',
              'Acciones',
            ].map((h) => (
              <th key={h} style={{ padding: 10, border: '1px solid #ddd' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={11} style={{ textAlign: 'center', padding: 20 }}>
                Cargando…
              </td>
            </tr>
          ) : reservas.length === 0 ? (
            <tr>
              <td colSpan={11} style={{ textAlign: 'center', padding: 20 }}>
                No hay reservas
              </td>
            </tr>
          ) : (
            reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td style={td}>{reserva.cliente?.nombre || '-'}</td>
                <td style={td}>{reserva.cliente?.apellido || '-'}</td>
                <td style={td}>{reserva.cliente?.telefono || '-'}</td>
                <td style={td}>{reserva.cliente?.email || '-'}</td>
                <td style={td}>{reserva.mesa.numero}</td>
                <td style={td}>{reserva.numPersonas}</td>
                <td style={td}>{reserva.observaciones || '—'}</td>
                <td style={td}>
                  {parseFecha(reserva.fechaInicio).toLocaleString('es-PE', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
                <td style={td}>
                  {parseFecha(reserva.fechaFin).toLocaleString('es-PE', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
                <td style={td}>{reserva.estado}</td>
                <td style={td}>
                  {reserva.estado !== 'Cancelado' && (
                    <button
                      onClick={() => handleCancel(reserva.id)}
                      style={{
                        background: '#d33',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        borderRadius: 4,
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// estilo de celdas
const td = { padding: 10, border: '1px solid #ddd' }

export default ReservaCrud
