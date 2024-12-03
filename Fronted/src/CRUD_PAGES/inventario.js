import React, { useState, useEffect } from 'react';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/productos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        return response.json();
      })
      .then((data) => {
        setInventario(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);


  const actualizarStock = (id, nuevoStock) => {
    if (isNaN(nuevoStock) || nuevoStock < 0) {
      setError('El stock debe ser un número positivo');
      return;
    }

    const producto = inventario.find((producto) => producto.id === id);

    if (!producto) return;

    fetch(`http://localhost:8080/api/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...producto,
        stock: nuevoStock,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar el stock');
        }
        return response.json();
      })
      .then((data) => {
        setInventario((prevInventario) =>
          prevInventario.map((prod) =>
            prod.id === id ? { ...prod, stock: nuevoStock } : prod
          )
        );
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h2 className="mb-4">Inventario</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID Producto</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventario.length === 0 ? (
            <tr>
              <td colSpan="6">No hay productos disponibles.</td>
            </tr>
          ) : (
            inventario.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria ? producto.categoria.nombre : 'Sin categoría'}</td>
                <td>S/ {producto.precio.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={producto.stock}
                    onChange={(e) => {
                      const updatedInventario = inventario.map((prod) =>
                        prod.id === producto.id ? { ...prod, stock: e.target.value } : prod
                      );
                      setInventario(updatedInventario);
                    }}
                    min="0"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => actualizarStock(producto.id, producto.stock)}
                  >
                    Actualizar Stock
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Inventario;
