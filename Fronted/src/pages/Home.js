// src/pages/Home.js
import React from 'react';
import { Carousel, Container, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import flamaBrava from '../assets/images/flama-brava.jpg';
import pollo from '../assets/images/pollo.png';
import parrilla from '../assets/images/parrillafamiliar.png';
import alitasBBQ from '../assets/images/alitasbbq.png';
import alitas from '../assets/images/alitas.jpg';
import ubicacion from '../assets/images/ubicacion.jpg';
import '../assets/styles/style.css'; // Asegúrate de tener los estilos cargados

const Home = () => {
  return (
    <div className="home-page">
      {/* Carrusel de Imágenes */}
      <Carousel className="carousel-container">
        <Carousel.Item>
          <img className="d-block w-100 carousel-image" src={flamaBrava} alt="Flama Brava" />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 carousel-image" src={pollo} alt="Pollo a la Brasa" />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 carousel-image" src={parrilla} alt="Parrilla Mixta" />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Sección de Información de la Empresa */}
      <Container className="text-center mt-5">
        <h2>¡Bienvenido a Pollería Flama Brava!</h2>
        <p>
          En Flama Brava nos dedicamos a ofrecerte los mejores platos con la calidad y el sabor que nos caracteriza. 
          Nuestra pasión por la cocina se refleja en cada bocado, utilizando siempre ingredientes frescos y de primera. 
          ¡Ven a disfrutar de una experiencia gastronómica única!
        </p>
      </Container>

      {/* Sección de Platos Destacados */}
      <Container className="my-5">
        <h2 className="text-center">Nuestros Platos Estrella</h2>
        <Row className="mt-4">
          <Col md={4}>
            <Card className="h-100">
              <Card.Img variant="top" src={alitasBBQ} alt="Alitas BBQ" className="card-image" />
              <Card.Body>
                <Card.Title>Alitas BBQ</Card.Title>
                <Card.Text>
                  Crujientes alitas bañadas en nuestra inigualable salsa BBQ.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Img variant="top" src={pollo} alt="Pollo a la Brasa" className="card-image" />
              <Card.Body>
                <Card.Title>Pollo a la Brasa</Card.Title>
                <Card.Text>
                  Nuestro plato insignia, preparado con una receta secreta y asado a la perfección.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Img variant="top" src={alitas} alt="Alitas Picantes" className="card-image" />
              <Card.Body>
                <Card.Title>Alitas Acevichadas</Card.Title>
                <Card.Text>
                  Deliciosas alitas acevichadas con nuestra nueva receta.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Sección de Ubícanos */}
      <Container className="ubicacion-section my-5">
        <h2 className="ubicacion-title">UBÍCANOS EN NUESTRO LOCAL</h2>
        <div className="ubicacion-content d-flex flex-column align-items-center">
          <img src={ubicacion} alt="Ubicación" className="ubicacion-image mb-3" />
          <div className="ubicacion-info text-center">
            <p>Encuéntranos en nuestra pollería ubicada en [Av.Inca Garcilazo de la vega F-13 Ica, Perú
            ].</p>
            <a href="https://www.google.com/maps/place/Flama+Brava/@-14.1519497,-75.6956046,17.05z/data=!4m9!1m2!2m1!1sAv.Inca+Garcilazo+de+la+vega+F-13+Ica,+Per%C3%BA!3m5!1s0x91111f80507d03f1:0xb9bfa14c4c7e4a4d!8m2!3d-14.1507976!4d-75.6921743!16s%2Fg%2F11qm5q4tq2?entry=ttu&g_ep=EgoyMDI0MTAyMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="ubicacion-link">
              Ver en Google Maps
            </a>
          </div>
        </div>
      </Container>

      {/* Sección de Redes Sociales */}
      <Container className="text-center my-5">
        <h2>Síguenos en nuestras redes sociales</h2>
        <div className="social-icons d-flex justify-content-center">
          <a href="https://www.facebook.com/FlamaBrava" target="_blank" rel="noreferrer" className="mx-3">
            <FaFacebook size={40} />
          </a>
          <a href="https://www.instagram.com/flamabrava/" target="_blank" rel="noreferrer" className="mx-3">
            <FaInstagram size={40} />
          </a>
          <a href="https://www.tiktok.com/@flamabrava?lang=es" target="_blank" rel="noreferrer" className="mx-3">
            <FaTiktok size={40} />
          </a>
          <a 
            href="https://wa.me/949570583" 
            target="_blank" 
            rel="noreferrer" 
            className="mx-3 d-flex align-items-center"
          >
            <FaWhatsapp size={40} />
            <span className="ms-2" style={{ color: '#FFF', fontWeight: 'bold', fontSize: '20px' }}>
            </span>
          </a>
        </div>
      </Container>
    </div>
  );
};

export default Home;
