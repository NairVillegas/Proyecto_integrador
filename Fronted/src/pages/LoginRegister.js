import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../assets/styles/login.css';

const LoginRegister = () => {
  const [isRegister, setIsRegister] = useState(false); // Estado para alternar entre login y registro
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    dni: '', // Nuevo campo
    email: '',
    celular: '', // Nuevo campo
    password: ''
  });

  // Manejar el cambio de formulario
  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  // Lógica para manejar los cambios de entrada en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  // Función para validar la contraseña
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinimumLength = password.length >= 8;
    return hasUpperCase && hasNumber && hasMinimumLength;
  };

  // Lógica de envío de formularios
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Lógica de autenticación simulada por ahora
    const isAuthenticated = true; // Simulación, cambia esta lógica según tus necesidades

    if (isAuthenticated) {
      Swal.fire({
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Usuario o contraseña incorrectos.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      });
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Validar la contraseña antes de registrar
    if (!validatePassword(newUser.password)) {
      Swal.fire({
        title: 'Error',
        text: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      });
      return;
    }

    // Validar DNI y celular
    if (newUser.dni.length !== 8 || isNaN(newUser.dni)) {
      Swal.fire({
        title: 'Error',
        text: 'El DNI debe tener 8 dígitos numéricos.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      });
      return;
    }

    if (newUser.celular.length !== 9 || isNaN(newUser.celular)) {
      Swal.fire({
        title: 'Error',
        text: 'El número de celular debe tener 9 dígitos numéricos.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      });
      return;
    }

    // Lógica de registro simulada por ahora
    const isRegistered = true; // Simulación, cambia esta lógica según tus necesidades

    if (isRegistered) {
      Swal.fire({
        title: '¡Registro exitoso!',
        text: 'Te has registrado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al registrarte. Intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
      });
    }
  };

  return (
    <div className="login-register-container">
      {isRegister ? (
        <div className="register-box">
          <h2>Registro</h2>
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" name="nombre" value={newUser.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Apellido:</label>
              <input type="text" name="apellido" value={newUser.apellido} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>DNI:</label>
              <input
                type="text"
                name="dni"
                value={newUser.dni}
                onChange={handleChange}
                maxLength="8"
                pattern="\d{8}"
                onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8))}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={newUser.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Celular:</label>
              <input
                type="text"
                name="celular"
                value={newUser.celular}
                onChange={handleChange}
                maxLength="9"
                pattern="\d{9}"
                onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9))}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="register-button">Registrarse</button>
          </form>
          <p className="toggle-text">
            ¿Ya tienes cuenta? <span onClick={toggleForm} className="toggle-link">Inicia Sesión</span>
          </p>
        </div>
      ) : (
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" required />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input type="password" required />
            </div>
            <button type="submit" className="login-button">Iniciar Sesión</button>
          </form>
          <p className="toggle-text">
            ¿No tienes cuenta? <span onClick={toggleForm} className="toggle-link">Regístrate</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;
