// src/pages/Misreservas.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import '../assets/styles/Misreservas.css'

export default function Misreservas() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem('usuario') || '{}')
    if (!usr.id) {
      setLoading(false)
      return
    }

    axios
      .get('http://localhost:8080/api/reservas')
      .then(({ data }) => {
        const mine = data.filter(r => r.cliente?.id === usr.id)
        setReservas(mine)
      })
      .catch(() => {
        Swal.fire('Error', 'No se pudieron cargar tus reservas', 'error')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async r => {
    const { value: motivo, isConfirmed } = await Swal.fire({
      title: 'Motivo de cancelación',
      input: 'textarea',
      inputLabel: '¿Por qué cancelas?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar'
    })
    if (!isConfirmed || !motivo) return

    try {
      const { data: upd } = await axios.put(
        `http://localhost:8080/api/reservas/${r.id}/cancelar`,
        { motivo }
      )
      setReservas(rs => rs.map(x => x.id === r.id ? upd : x))
      Swal.fire('Hecho', 'Reserva cancelada', 'success')
    } catch {
      Swal.fire('Error', 'No se pudo cancelar', 'error')
    }
  }

  const parseFecha = f => {
    if (Array.isArray(f)) {
      const [y, m, d, h, min] = f
      return new Date(y, m - 1, d, h, min)
    }
    return new Date(f)
  }

  return (
    <div className="reservas-container">
      <h2 className="reservas-title">Mis Reservas</h2>
      <table className="reservas-table">
        <thead>
          <tr>
            {[
              'Cliente','Apellido','Teléfono','Correo',
              'Mesa','Inicio','Fin','Estado','Observaciones','Acciones'
            ].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={10} style={{ textAlign:'center' }}>Cargando…</td>
            </tr>
          ) : reservas.length === 0 ? (
            <tr>
              <td colSpan={10} style={{ textAlign:'center' }}>No tienes reservas</td>
            </tr>
          ) : (
            reservas.map(r => (
              <tr key={r.id}>
                <td>{r.cliente?.nombre || '-'}</td>
                <td>{r.cliente?.apellido || '-'}</td>
                <td>{r.cliente?.telefono || '-'}</td>
                <td>{r.cliente?.email || '-'}</td>
                <td>{r.mesa.nroMesa}</td>
                <td>{parseFecha(r.fechaInicio).toLocaleString()}</td>
                <td>{parseFecha(r.fechaFin).toLocaleString()}</td>
                <td>{r.estado}</td>
                <td>{r.observaciones || '—'}</td>
                <td>
                  {r.estado !== 'Cancelado' && (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(r)}
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
