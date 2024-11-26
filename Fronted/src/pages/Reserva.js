import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import "../assets/styles/Reserva.css";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';

// Registramos el idioma español
registerLocale("es", es);

const Reserva = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [dni, setDni] = useState(""); // Estado para manejar el campo de DNI
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState(""); // Estado para manejar el campo de celular
  const [comentarios, setComentarios] = useState("");

  // Horarios permitidos: 9:30 AM a 4:00 PM y 6:00 PM a 9:30 PM
  const isTimeSelectable = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();

    // Horario de la mañana: 9:30 AM a 4:00 PM
    if ((hours === 9 && minutes >= 30) || (hours >= 10 && hours < 16)) {
      return true;
    }

    // Horario de la tarde-noche: 6:00 PM a 9:30 PM
    if ((hours === 18) || (hours >= 19 && hours < 21) || (hours === 21 && minutes <= 30)) {
      return true;
    }

    return false;
  };

  // Manejar el cambio en el campo DNI, permitiendo solo números y un máximo de 8 dígitos
  const handleDniChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,8}$/.test(value)) {
      setDni(value);
    }
  };

  // Manejar el cambio en el campo celular, permitiendo solo números y un máximo de 9 dígitos
  const handleCelularChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setCelular(value);
    }
  };

  const handleSelectMesa = (mesa) => {
    setSelectedMesa(mesa);
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar campos o realizar cualquier lógica adicional aquí

    Swal.fire({
        title: '¡Reserva exitosa!',
        text: 'Tu mesa ha sido reservada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        setStartDate(new Date());
        setDni("");
        setNombre("");
        setEmail("");
        setCelular(""); // Reseteamos el celular
        setComentarios("");
        setSelectedMesa(null);
        e.target.reset();
      });
    };

  return (
    <div className="reserva-page"> {/* Clase específica para la página de reserva */}
    <div className="container reserva-container">
      <h2 className="text-center mb-4">Reservar Mesa</h2>
      <form className="reserva-form" onSubmit={handleSubmit}>
        <div className="form-group mb-3">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

        <div className="form-group mb-3">
            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              className="form-control"
              placeholder="Ingrese su DNI"
              value={dni}
              onChange={handleDniChange}
              pattern="\d{8}" // Solo permite 8 dígitos
              required
              title="El DNI debe ser de 8 dígitos numéricos"
            />
          </div>

        <div className="form-group mb-3">
          <label htmlFor="celular">Celular</label>
          <input
            type="text"
            id="celular"
            className="form-control"
            placeholder="Ingrese su celular"
            value={celular}
            onChange={handleCelularChange}
            pattern="\d{9}" // Solo permite 9 dígitos
            required
            title="El número de celular debe ser de 9 dígitos numéricos"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="email">Correo Electrónico</label>
          <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

        <div className="form-group mb-3">
          <label htmlFor="fechaHora">Fecha y Hora</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            filterTime={isTimeSelectable} // Filtrar horarios permitidos
            minDate={new Date()} // Bloquear fechas pasadas
            dateFormat="Pp"
            locale="es" // Establecer el idioma a español
            className="form-control"
            id="fechaHora"
            placeholderText="Seleccione fecha y hora"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="mesa">Mesa</label>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Seleccionar Mesa
          </Button>
          {selectedMesa && <p className="mt-2">Mesa Seleccionada: {selectedMesa}</p>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="comentarios">Comentarios</label>
          <textarea
              id="comentarios"
              className="form-control"
              rows="3"
              placeholder="Comentarios adicionales"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            ></textarea>
          </div>

        <button type="submit" className="btn btn-success w-100">Reservar</button>
      </form>

      {/* Modal de selección de mesa */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Mesa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mapa-mesas">
            {/* Mesas disponibles */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default Reserva;
