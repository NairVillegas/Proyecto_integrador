// src/components/Reserva.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Reserva.css';

const Reserva = () => {
  const navigate = useNavigate();

  // --- 1) Estado del usuario logueado (traído de localStorage) ---
  const [userData, setUserData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });

  // --- 2) Estado del formulario ---
  const [formData, setFormData] = useState({
    fecha: '',         // "YYYY-MM-DD"
    hora: '',          // "h:00 AM/PM"
    numPersonas: 1,    // número de personas (capacidad exacta)
    mesa: '',          // id de la mesa seleccionada
    observaciones: ''  // texto opcional
  });

  // --- 3) Mesas disponibles (capacidad == numPersonas y libres en esa hora) ---
  const [mesasDisponibles, setMesasDisponibles] = useState([]);

  // --- 4) Aforo restante para la fecha+hora seleccionada ---
  const [aforoRestante, setAforoRestante] = useState(null);
  const [errorAforo, setErrorAforo] = useState('');

  // ─────────────────────────────────────────────────────────────────────
  // useEffect #1: Al montar el componente, cargamos usuario y fijamos fecha+hora inicial
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // 1.1) Verificar si hay usuario en localStorage; si no, redirigir a /login
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      Swal.fire({
        title: '¡No estás logeado!',
        text: 'Para hacer una reserva, necesitas iniciar sesión.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      }).then(() => navigate('/login'));
      return;
    }
    setUserData({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono
    });

    // 1.2) Inicializar fecha a hoy y hora a la hora “en punto” siguiente o actual
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm   = String(ahora.getMonth() + 1).padStart(2, '0');
    const dd   = String(ahora.getDate()).padStart(2, '0');
    const fechaHoy = `${yyyy}-${mm}-${dd}`;

    let horaNum = ahora.getHours();
    if (ahora.getMinutes() > 0 || ahora.getSeconds() > 0) {
      horaNum += 1;
      if (horaNum > 23) horaNum = 23;
    }
    const suf = horaNum >= 12 ? 'PM' : 'AM';
    let h12 = horaNum % 12;
    h12 = h12 === 0 ? 12 : h12;
    const horaHoy12 = `${h12}:00 ${suf}`;

    setFormData(prev => ({
      ...prev,
      fecha: fechaHoy,
      hora: horaHoy12
    }));
  }, [navigate]);

  // ─────────────────────────────────────────────────────────────────────
  // useEffect #2: Cada vez que cambien fecha, hora o numPersonas →
  //   a) volver a pedir aforo
  //   b) volver a pedir mesas disponibles (capacidad exacta)
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const { fecha, hora, numPersonas } = formData;

    if (!fecha || !hora || !numPersonas) {
      setAforoRestante(null);
      setMesasDisponibles([]);
      return;
    }

    // --- 2.a) Pedir aforo restante para fecha+hora en punto ---
    const fechaISO_aforo = toISOStringLocal(fecha, hora);
    axios.get('http://localhost:8080/api/aforo', {
      params: { fecha: fechaISO_aforo }
    })
      .then(resp => {
        const aforo = resp.data.aforoRestante;
        if (aforo === undefined || aforo === null) {
          setErrorAforo('La respuesta del servidor no incluye "aforoRestante".');
          setAforoRestante(0);
        } else {
          setErrorAforo('');
          setAforoRestante(aforo);
        }
      })
      .catch(err => {
        console.error('Error al obtener aforo →', err);
        setAforoRestante(null);
        setErrorAforo('No se pudo obtener el aforo disponible.');
      });

    // --- 2.b) Pedir mesas disponibles (capacidad EXACTA) ---
    const fechaISO_mesas = toISOStringLocal(fecha, hora);
    axios.get('http://localhost:8080/api/mesas/disponibles', {
      params: {
        fecha: fechaISO_mesas,
        numPersonas: parseInt(numPersonas, 10)
      }
    })
      .then(resp => {
        setMesasDisponibles(resp.data);
      })
      .catch(err => {
        console.error('Error al obtener mesas disponibles →', err);
        setMesasDisponibles([]);
      });
  }, [formData.fecha, formData.hora, formData.numPersonas]);

  // ─────────────────────────────────────────────────────────────────────
  // handleSubmit: Enviar POST /api/reservas para crear la reserva
  // ─────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fechaISO = toISOStringLocal(formData.fecha, formData.hora);

    const reservaData = {
      idUsuario: userData.id,
      mesa: { id: parseInt(formData.mesa, 10) },
      fecha: fechaISO,
      numPersonas: parseInt(formData.numPersonas, 10),
      observaciones: formData.observaciones
    };

    try {
      const resp = await axios.post('http://localhost:8080/api/reservas', reservaData);

      // Si el backend retorna { reserva: {...}, aforoRestante: NN }
      console.log('RESPUESTA POST /api/reservas →', resp.data);

      let nuevoAforo = resp.data.aforoRestante;
      if (nuevoAforo === undefined || nuevoAforo === null) {
        // Volver a solicitarlo en su defecto:
        const resp2 = await axios.get('http://localhost:8080/api/aforo', {
          params: { fecha: fechaISO }
        });
        nuevoAforo = resp2.data.aforoRestante ?? 0;
      }

      setAforoRestante(nuevoAforo);

      // Marcar mesa como “Ocupado” (opcional, según tu API)
      await axios.put(
        `http://localhost:8080/api/mesas/${reservaData.mesa.id}`,
        { estado: 'Libre' }
      ).catch(() => { /* ignorar */ });

      Swal.fire({
        title: 'Reserva realizada',
        text: `Quedan ${nuevoAforo} lugares.`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      // (Opcional) Limpiar selección de mesa:
      // setFormData(prev => ({ ...prev, mesa: '' }));

    } catch (error) {
      console.error('ERROR EN POST /api/reservas →', error.response?.data || error.message);
      let mensaje = 'Hubo un problema al crear la reserva.';
      if (error.response && error.response.status === 409) {
        mensaje = error.response.data.error || mensaje;
      }
      Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  // ─────────────────────────────────────────────────────────────────────
  // Helper: convierte "YYYY-MM-DD" + "h:00 AM/PM" → "YYYY-MM-DDTHH:00:00"
  // ─────────────────────────────────────────────────────────────────────
  const toISOStringLocal = (fechaStr, horaStr) => {
    // horaStr viene en formato: "3:00 PM" ó "11:00 AM"
    let [horamin, suf] = horaStr.split(' ');
    let [h, _] = horamin.split(':').map(Number);

    if (suf === 'PM' && h !== 12) h += 12;
    if (suf === 'AM' && h === 12) h = 0;
    const hh = String(h).padStart(2, '0');
    return `${fechaStr}T${hh}:00:00`;
  };

  // ─────────────────────────────────────────────────────────────────────
  // Renderizado: formulario y controles
  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="reserva-page">
      <div className="container reserva-container">
        <h2 className="text-center mb-4">Reserva tu Mesa</h2>
        <p className="text-center text-muted">Completa los datos para reservar</p>

        <form onSubmit={handleSubmit}>

          {/* --- Nombre (readOnly) --- */}
          <div className="mb-3">
            <label className="form-label">Nombre:</label>
            <input
              type="text"
              className="form-control"
              value={userData.nombre}
              readOnly
            />
          </div>

          {/* --- Apellido (readOnly) --- */}
          <div className="mb-3">
            <label className="form-label">Apellido:</label>
            <input
              type="text"
              className="form-control"
              value={userData.apellido}
              readOnly
            />
          </div>

          {/* --- Correo (readOnly) --- */}
          <div className="mb-3">
            <label className="form-label">Correo:</label>
            <input
              type="email"
              className="form-control"
              value={userData.email}
              readOnly
            />
          </div>

          {/* --- Teléfono (readOnly) --- */}
          <div className="mb-3">
            <label className="form-label">Teléfono:</label>
            <input
              type="text"
              className="form-control"
              value={userData.telefono}
              readOnly
            />
          </div>

          {/* --- Fecha de la reserva --- */}
          <div className="mb-3">
            <label htmlFor="fecha" className="form-label">Fecha:</label>
            <input
              type="date"
              className="form-control"
              id="fecha"
              value={formData.fecha}
              onChange={e => setFormData({ ...formData, fecha: e.target.value })}
              min={(() => {
                const d = new Date();
                const y = d.getFullYear();
                const mo = String(d.getMonth() + 1).padStart(2, '0');
                const da = String(d.getDate()).padStart(2, '0');
                return `${y}-${mo}-${da}`;
              })()}
              required
            />
          </div>

          {/* --- Hora (solo en punto) --- */}
          <div className="mb-3">
            <label htmlFor="hora" className="form-label">Hora:</label>
            <select
              className="form-control"
              id="hora"
              value={formData.hora}
              onChange={e => setFormData({ ...formData, hora: e.target.value })}
              required
            >
              <option value="">Selecciona una hora</option>
              {(() => {
                const horas = [];
                // Horario de 11:00 AM a 11:00 PM
                for (let H = 11; H <= 23; H++) {
                  const suf = H >= 12 ? 'PM' : 'AM';
                  let H12 = H % 12;
                  H12 = H12 === 0 ? 12 : H12;
                  horas.push(`${H12}:00 ${suf}`);
                }
                return horas.map((etq, i) => (
                  <option key={i} value={etq}>{etq}</option>
                ));
              })()}
            </select>
          </div>

          {/* --- Número de Personas --- */}
          <div className="mb-3">
            <label htmlFor="numPersonas" className="form-label">Número de Personas:</label>
            <input
              type="number"
              className="form-control"
              id="numPersonas"
              min="1"
              max="30"
              value={formData.numPersonas}
              onChange={e => setFormData({ ...formData, numPersonas: e.target.value })}
              required
            />
          </div>

          {/* --- Aforo Restante --- */}
          <div className="mb-3">
            {aforoRestante !== null && (
              <p><strong>Aforo restante:</strong> {aforoRestante} lugares</p>
            )}
            {errorAforo && <p style={{ color: 'red' }}>{errorAforo}</p>}
          </div>

          {/* --- Mesa: sólo mesas con capacidad EXACTA y libres --- */}
          <div className="mb-3">
            <label htmlFor="mesa" className="form-label">Mesa:</label>
            <select
              className="form-control"
              id="mesa"
              value={formData.mesa}
              onChange={e => setFormData({ ...formData, mesa: e.target.value })}
              required
            >
              <option value="">Selecciona una mesa</option>
              {mesasDisponibles.length > 0
                ? mesasDisponibles.map(mesaObj => (
                    <option key={mesaObj.id} value={mesaObj.id}>
                      Mesa {mesaObj.numero} (Capacidad: {mesaObj.capacidad})
                    </option>
                  ))
                : <option value="" disabled>
                    { (formData.fecha && formData.hora && formData.numPersonas)
                      ? 'No hay mesas con esa capacidad disponibles'
                      : 'Selecciona fecha, hora y número de personas'
                    }
                  </option>
              }
            </select>
          </div>

          {/* --- Observaciones (opcional) --- */}
          <div className="mb-3">
            <label htmlFor="observaciones" className="form-label">Observaciones:</label>
            <textarea
              className="form-control"
              id="observaciones"
              rows="3"
              value={formData.observaciones}
              onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
            />
          </div>

          {/* --- Botón “Confirmar Reserva” (se deshabilita si numPersonas > aforoRestante) --- */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={
              !formData.mesa ||
              (aforoRestante !== null &&
               parseInt(formData.numPersonas, 10) > aforoRestante)
            }
          >
            Confirmar Reserva
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reserva;
