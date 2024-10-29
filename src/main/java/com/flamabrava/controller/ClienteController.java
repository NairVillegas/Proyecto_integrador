package com.flamabrava.controller;

import com.flamabrava.model.Cliente;
import com.flamabrava.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

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
    public Cliente createCliente(@RequestBody Cliente cliente) {
        return clienteService.save(cliente);
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
            clienteToUpdate.setDireccion(clienteDetails.getDireccion());
            return ResponseEntity.ok(clienteService.save(clienteToUpdate));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Integer id) {
        clienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
