import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const Mesas = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mesaData, setMesaData] = useState({ numero: "", capacidad: "" });
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/mesas");
        setMesas(response.data);
      } catch (error) {
        console.error("Error al obtener las mesas:", error);
      }
    };

    fetchMesas();
  }, []);


  const handleSelectMesa = (mesa) => {
    setSelectedMesa(mesa);
    setMesaData({ numero: mesa.numero, capacidad: mesa.capacidad });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMesa(null);
  };

  const handleAddMesa = () => {
    setShowAddForm(true); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMesaData({
      ...mesaData,
      [name]: value,
    });
  };

  const handleSubmitAddMesa = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/mesas", mesaData);
      console.log("Mesa agregada:", response.data);
      setMesas([...mesas, response.data]);
      setShowAddForm(false);
      setMesaData({ numero: "", capacidad: "" });
    } catch (error) {
      console.error("Error al agregar mesa:", error);
    }
  };

  const handleEditMesa = async (e) => {
    e.preventDefault();
    if (selectedMesa) {
      try {
        const updatedMesa = { ...selectedMesa, ...mesaData };
        const response = await axios.put(`http://localhost:8080/api/mesas/${selectedMesa.id}/numero-capacidad`, updatedMesa);
        
        
        console.log("Respuesta del servidor:", response.data);
  
   
        setMesas(
          mesas.map((mesa) =>
            mesa.id === selectedMesa.id ? response.data : mesa
          )
        );
  
     
        setSelectedMesa(null);
        setMesaData({ numero: "", capacidad: "" });
        handleCloseModal();
      } catch (error) {
        console.error("Error al editar mesa:", error);
    
        alert("Hubo un problema al actualizar la mesa. Intenta nuevamente.");
      }
    }
  };
  

  const handleDeleteMesa = async (mesaId) => {
    try {
      await axios.delete(`http://localhost:8080/api/mesas/${mesaId}`);
      setMesas(mesas.filter((mesa) => mesa.id !== mesaId));
    } catch (error) {
      console.error("Error al eliminar mesa:", error);
    }
  };

  const toggleMesaEstado = async (mesaId, currentEstado) => {
    const newEstado = currentEstado === "Libre" ? "Ocupado" : "Libre";
    try {
      const response = await axios.put(`http://localhost:8080/api/mesas/${mesaId}`, { estado: newEstado });
      setMesas(
        mesas.map((mesa) =>
          mesa.id === mesaId ? { ...mesa, estado: newEstado } : mesa
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado de la mesa:", error);
    }
  };

  return (
    <div className="">
      <Button variant="primary" onClick={handleAddMesa}>
        Agregar Mesa
      </Button><p></p>

      {showAddForm && (
        <Form onSubmit={handleSubmitAddMesa}>
          <Form.Group controlId="formNumero">
            <Form.Label>Número de Mesa</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el número de la mesa"
              name="numero"
              value={mesaData.numero}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formCapacidad">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese la capacidad"
              name="capacidad"
              value={mesaData.capacidad}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Agregar Mesa
          </Button>
          <Button variant="secondary" onClick={() => setShowAddForm(false)}>
            Cancelar
          </Button>
        </Form>
      )}

      <div className="container-mesa">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Número de Mesa</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mesas.map((mesa) => (
              <tr key={mesa.id}>
                <td>{mesa.numero}</td>
                <td>{mesa.capacidad}</td>
                <td>
                  <Button
                    variant={mesa.estado === "Ocupado" ? "danger" : "success"}
                    onClick={() => toggleMesaEstado(mesa.id, mesa.estado)}
                  >
                    {mesa.estado}
                  </Button>
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleSelectMesa(mesa)}
                    style={{ marginRight: "10px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteMesa(mesa.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Mesa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditMesa}>
            <Form.Group controlId="formNumero">
              <Form.Label>Número de Mesa</Form.Label>
              <Form.Control
                type="number"
                name="numero"
                value={mesaData.numero}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCapacidad">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                name="capacidad"
                value={mesaData.capacidad}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Mesas;
