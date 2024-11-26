// src/components/Header.js
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import '../assets/styles/style.css'; // Asegúrate de importar el archivo CSS

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
      <Navbar.Brand href="/" className="navbar-logo">
        <img
          src="/images/logo.jpg"
          width="70" /* Incrementamos el tamaño del logo */
          height="70"
          className="d-inline-block align-top"
          alt="Logo Pollería Flama Brava"
          style={{ borderRadius: '50%', boxShadow: '0px 0px 10px rgba(0,0,0,0.5)' }} /* Añadimos sombra */
        />
        
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto navbar-links">
          <Nav.Link href="/" className="nav-text">Inicio</Nav.Link>
          <Nav.Link href="/menu" className="nav-text">Menú</Nav.Link>
          <Nav.Link href="/reserva" className="nav-text">Reserva</Nav.Link>
          <Nav.Link href="/login" className="nav-text">Iniciar Sesión</Nav.Link>
          <Nav.Link href="/paymentpage" className="nav-text">Pago</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
