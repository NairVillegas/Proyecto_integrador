package com.flamabrava.service;

import com.flamabrava.model.Producto;
import com.flamabrava.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@Service
@CrossOrigin(origins = "https://polleriaflamabrava.netlify.app")
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> findAll() {
        return productoRepository.findAll(); // Devuelve todos los productos
    }

    public Optional<Producto> findById(Integer id) {
        return productoRepository.findById(id); // Busca un producto por ID
    }

    public Producto save(Producto producto) {
        return productoRepository.save(producto); // Guarda el producto en la base de datos
    }

    public void deleteById(Integer id) {
        productoRepository.deleteById(id); // Elimina un producto por ID
    }
}
