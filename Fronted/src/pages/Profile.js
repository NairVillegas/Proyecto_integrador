import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../assets/styles/Profile.css';
import LogoEditar from "../assets/images/LogoEditar.png";

const Profile = () => {
  const [userData, setUserData] = useState({
    id: '',
    nombre: '',
    dni: '',
    correo: '',
    telefono: '', 
  });

  const [editableFields, setEditableFields] = useState({ telefono: false });

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      setUserData({
        id: usuario.id,
        nombre: usuario.nombre,
        dni: usuario.dni,
        correo: usuario.email,
        telefono: usuario.telefono, 
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleEdit = (field) => {
    setEditableFields({ [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const telefonoPattern = /^[0-9]{9}$/; 
    if (editableFields.telefono && !telefonoPattern.test(userData.telefono)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El número de teléfono debe tener 9 dígitos.',
      });
      return;
    }


    const updatedData = {};
    if (editableFields.telefono) updatedData.telefono = userData.telefono;


    if (Object.keys(updatedData).length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No hay cambios',
        text: 'No se han realizado cambios en los datos.',
      });
      return;
    }


    try {
      const response = await axios.put(`http://localhost:8080/api/clientes/${userData.id}`, updatedData);

      if (response.status === 200) {
        const updatedUserData = { ...userData, ...updatedData };
        localStorage.setItem('usuario', JSON.stringify(updatedUserData));

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos del perfil se han actualizado correctamente.',
        });

        setEditableFields({ telefono: false });
        setUserData(updatedUserData);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron actualizar los datos. Intenta nuevamente.',
      });
    }
  };

  return (
    <div className="container profile-page">
      <h2 className="text-center mb-4">Mi Cuenta</h2>
      <p className="text-center text-muted">Gestiona tu información personal y preferencias</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre:</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={userData.nombre}
            readOnly
            style={{ cursor: 'not-allowed' }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="dni" className="form-label">DNI:</label>
          <input
            type="text"
            className="form-control"
            id="dni"
            name="dni"
            value={userData.dni}
            readOnly
            style={{ cursor: 'not-allowed' }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo:</label>
          <input
            type="email"
            className="form-control"
            id="correo"
            name="correo"
            value={userData.correo}
            readOnly
            style={{ cursor: 'not-allowed' }}
          />
        </div>

        <div className="mb-3 position-relative">
          <label htmlFor="telefono" className="form-label">Teléfono:</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="telefono"
              name="telefono"
              value={userData.telefono}
              onChange={handleChange}
              readOnly={!editableFields.telefono} 
            />
            <img
              src={LogoEditar}
              alt="Editar"
              className="position-absolute"
              style={{
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                width: '24px',
                height: '24px',
              }}
              onClick={() => handleEdit('telefono')}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success" disabled={!editableFields.telefono}>Guardar Cambios</button>
      </form>
    </div>
  );
};

export default Profile;
