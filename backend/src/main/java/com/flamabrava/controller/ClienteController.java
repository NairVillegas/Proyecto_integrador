package com.flamabrava.controller;

import com.flamabrava.model.Cliente;
import com.flamabrava.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping("/login")
    public ResponseEntity<Cliente> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String contrasena = credentials.get("contrasena");

        Optional<Cliente> cliente = clienteService.findByEmail(email);

        if (cliente.isPresent() && cliente.get().getContrasena().equals(contrasena)) {
            Cliente clienteLogueado = cliente.get();
            clienteLogueado.setIsActive(true);
            clienteService.save(clienteLogueado);
            return ResponseEntity.ok(clienteLogueado);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");

        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Falta el correo electrónico");
        }

        Optional<Cliente> cliente = clienteService.findByEmail(email);

        if (cliente.isPresent()) {
            Cliente clienteLogueado = cliente.get();
            clienteLogueado.setIsActive(false);
            clienteService.save(clienteLogueado);
            return ResponseEntity.ok("Cierre de sesión exitoso");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado");
        }
    }

    @GetMapping
    public List<Cliente> getAllClientes() {
        return clienteService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Integer id) {
        Optional<Cliente> cliente = clienteService.findById(id);
        return cliente.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cliente> createCliente(@RequestBody Cliente cliente) {
        if (cliente == null || cliente.getDni() == null || cliente.getContrasena() == null) {
            return ResponseEntity.badRequest().build();
        }
        Cliente savedCliente = clienteService.save(cliente);
        return ResponseEntity.ok(savedCliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> updateCliente(@PathVariable Integer id, @RequestBody Cliente clienteDetails) {
        Optional<Cliente> cliente = clienteService.findById(id);
        if (cliente.isPresent()) {
            Cliente clienteToUpdate = cliente.get();
            clienteToUpdate.setNombre(clienteDetails.getNombre());
            clienteToUpdate.setApellido(clienteDetails.getApellido());
            clienteToUpdate.setEmail(clienteDetails.getEmail());
            clienteToUpdate.setTelefono(clienteDetails.getTelefono());
            clienteToUpdate.setDni(clienteDetails.getDni());
            clienteToUpdate.setContrasena(clienteDetails.getContrasena());
            return ResponseEntity.ok(clienteService.save(clienteToUpdate));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Integer id) {
        if (!clienteService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        clienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
