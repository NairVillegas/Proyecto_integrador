// src/components/Reserva.js

import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/Reserva.css'

const Reserva = () => {
  const navigate = useNavigate()

  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    numPersonas: 1,
    mesa: '',
    observaciones: ''
  })
  const [mesasDisponibles, setMesasDisponibles] = useState([])
  const [aforoRestante, setAforoRestante] = useState(null)

  const allSlots = useMemo(() => {
    const slots = []
    for (let m = 11 * 60; m <= 23 * 60; m += 15) {
      const h = Math.floor(m / 60)
      const min = m % 60
      const h12 = ((h + 11) % 12) + 1
      const suf = h >= 12 ? 'PM' : 'AM'
      slots.push(`${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${suf}`)
    }
    return slots
  }, [])

  const toMinutes = t => {
    const [hm, suf] = t.split(' ')
    let [h, m] = hm.split(':').map(Number)
    if (suf === 'PM' && h !== 12) h += 12
    if (suf === 'AM' && h === 12) h = 0
    return h * 60 + m
  }

  const to24h = t => {
    const [hm, suf] = t.split(' ')
    let [h, m] = hm.split(':').map(Number)
    if (suf === 'PM' && h !== 12) h += 12
    if (suf === 'AM' && h === 12) h = 0
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
  }

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('usuario'))
    if (!u) {
      Swal.fire('No estás logeado', 'Debes iniciar sesión', 'warning').then(() =>
        navigate('/login')
      )
      return
    }
    setUserData(u)

    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    setFormData(f => ({ ...f, fecha: `${yyyy}-${mm}-${dd}` }))
  }, [navigate])

  useEffect(() => {
    const { fecha, hora_inicio, hora_fin, numPersonas } = formData
    if (!fecha || !hora_inicio || !hora_fin) {
      setAforoRestante(null)
      setMesasDisponibles([])
      return
    }

    const params = {
      fechaInicio: `${fecha}T${to24h(hora_inicio)}:00`,
      fechaFin:    `${fecha}T${to24h(hora_fin)}:00`,
      numPersonas
    }

    // a) Aforo en rango
    axios
      .get('http://localhost:8080/api/reservas/aforo', { params })
      .then(r => setAforoRestante(r.data.aforoRestante))
      .catch(() => setAforoRestante(null))

    // b) Mesas libres en rango
    axios
      .get('http://localhost:8080/api/mesas/disponibles', { params })
      .then(r => setMesasDisponibles(r.data))
      .catch(() => setMesasDisponibles([]))
  }, [
    formData.fecha,
    formData.hora_inicio,
    formData.hora_fin,
    formData.numPersonas
  ])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(f => ({
      ...f,
      [name]: value,
      ...(name === 'hora_inicio' ? { hora_fin: '' } : {})
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const payload = {
      idUsuario:    userData.id,
      mesa:         { id: parseInt(formData.mesa, 10) },
      fechaInicio:  `${formData.fecha}T${to24h(formData.hora_inicio)}:00`,
      fechaFin:     `${formData.fecha}T${to24h(formData.hora_fin)}:00`,
      numPersonas:  formData.numPersonas,
      observaciones: formData.observaciones
    }
    try {
      const r = await axios.post('http://localhost:8080/api/reservas', payload)
      Swal.fire('¡Reserva OK!', `Quedan ${r.data.aforoRestante} lugares`, 'success')
      setFormData(f => ({
        ...f,
        hora_inicio: '',
        hora_fin: '',
        mesa: '',
        observaciones: ''
      }))
    } catch {
      Swal.fire('Error', 'No se pudo reservar', 'error')
    }
  }

  if (!userData) return null
  return (
    <div className="reserva-page">
      <div className="container reserva-container">
        <h2>Reserva tu Mesa</h2>
        <form onSubmit={handleSubmit}>
          {['nombre', 'apellido', 'email', 'telefono'].map(f => (
            <div key={f} className="mb-3">
              <label className="form-label">
                {f.charAt(0).toUpperCase() + f.slice(1)}:
              </label>
              <input className="form-control" value={userData[f]} readOnly />
            </div>
          ))}

          <div className="mb-3">
            <label>Fecha:</label>
            <input
              type="date"
              className="form-control"
              value={formData.fecha}
              onChange={e =>
                setFormData(f => ({ ...f, fecha: e.target.value }))
              }
              required
            />
          </div>

          <div className="mb-3">
            <label>Hora Desde / Hasta:</label>
            <div className="d-flex gap-2">
              <select
                name="hora_inicio"
                className="form-control"
                value={formData.hora_inicio}
                onChange={handleChange}
                required
              >
                <option value="">Desde</option>
                {allSlots
                  .filter(s => toMinutes(s) % 60 === 0)
                  .map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
              <select
                name="hora_fin"
                className="form-control"
                value={formData.hora_fin}
                onChange={handleChange}
                disabled={!formData.hora_inicio}
                required
              >
                <option value="">Hasta</option>
                {allSlots
                  .filter(s => {
                    const ini = toMinutes(formData.hora_inicio)
                    const fin = toMinutes(s)
                    return fin > ini && fin <= ini + 120
                  })
                  .map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label>Número de Personas:</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={formData.numPersonas}
              onChange={e =>
                setFormData(f => ({ ...f, numPersonas: e.target.value }))
              }
              required
            />
          </div>

          {aforoRestante != null && (
            <p>
              <strong>Aforo restante:</strong> {aforoRestante}
            </p>
          )}

          <div className="mb-3">
            <label>Mesa:</label>
            <select
              className="form-control"
              value={formData.mesa}
              onChange={e =>
                setFormData(f => ({ ...f, mesa: e.target.value }))
              }
              required
            >
              <option value="">Selecciona mesa</option>
              {mesasDisponibles.map(m => (
                <option key={m.id} value={m.id}>
                  Mesa {m.numero} (cap:{m.capacidad})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Observaciones:</label>
            <textarea
              className="form-control"
              value={formData.observaciones}
              onChange={e =>
                setFormData(f => ({ ...f, observaciones: e.target.value }))
              }
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Confirmar Reserva
          </button>
        </form>
      </div>
    </div>
  )
}

export default Reserva
