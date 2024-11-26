package com.flamabrava.controller;

import com.flamabrava.model.Producto;
import com.flamabrava.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Integer id) {
        Optional<Producto> producto = productoService.findById(id);
        return producto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        return productoService.save(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Integer id, @RequestBody Producto productoDetails) {
        Optional<Producto> producto = productoService.findById(id);
        if (producto.isPresent()) {
            Producto productoToUpdate = producto.get();
            productoToUpdate.setNombre(productoDetails.getNombre());
            productoToUpdate.setDescripcion(productoDetails.getDescripcion());
            productoToUpdate.setPrecio(productoDetails.getPrecio());
            productoToUpdate.setStock(productoDetails.getStock());
            productoToUpdate.setCategoria(productoDetails.getCategoria());
            return ResponseEntity.ok(productoService.save(productoToUpdate));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
