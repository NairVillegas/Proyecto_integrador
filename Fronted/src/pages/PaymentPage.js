import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentPage = () => {
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const handleCheckout = () => {
    alert('Proceeding to payment!');
  };

  return (
    <Container className="mt-5">
      <Row>
        {/* Columna para la Información de Pago */}
        <Col md={8}>
          <h2 className="text-center mb-4">Payment Information</h2>

          <div className="step-indicator text-center mb-4">
            <span className="mx-2">1. Your Cart</span>|
            <span className="mx-2">2. Details</span>|
            <span className="mx-2">3. Shipping</span>|
            <span className="mx-2">4. Payment</span>|
            <span className="mx-2">5. Complete</span>
          </div>

          <Card className="shadow-sm">
            <Card.Body>
              <h4>Your Cart</h4>
              <p>Item: Cleanse + Glow Set - $99.00</p>
              <hr />
              <h5>Total: $99.00</h5>
              <hr />
              <h5>Contact Information</h5>
              <Form>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formAddress">
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formState">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        as="select"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option value="">Select State</option>
                        <option value="Arizona">Arizona</option>
                        <option value="California">California</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formZip">
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Zip code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" block onClick={handleCheckout}>
                  Proceed to Payment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna para el Resumen de la Orden */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4>Order Summary</h4>
              <p>Cleanse + Glow Set - $99.00</p>
              <hr />
              <h5>Total: $99.00</h5>
              <hr />
              <Button variant="success" block className="mb-2">
                Checkout with PayPal
              </Button>
              <Button variant="info" block className="mb-2">
                Checkout with Google Pay
              </Button>
              <Button variant="warning" block>
                Checkout with Shop Pay
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
