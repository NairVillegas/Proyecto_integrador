package com.flamabrava.controller;

import com.flamabrava.model.Mesa;
import com.flamabrava.service.MesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {

    @Autowired
    private MesaService mesaService;

    @GetMapping
    public List<Mesa> getAllMesas() {
        return mesaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mesa> getMesaById(@PathVariable Integer id) {
        Optional<Mesa> mesa = mesaService.findById(id);
        return mesa.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mesa createMesa(@RequestBody Mesa mesa) {
        return mesaService.save(mesa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mesa> updateMesa(@PathVariable Integer id, @RequestBody Mesa mesaDetails) {
        Optional<Mesa> mesa = mesaService.findById(id);
        if (mesa.isPresent()) {
            Mesa mesaToUpdate = mesa.get();
            mesaToUpdate.setNumero(mesaDetails.getNumero());
            mesaToUpdate.setCapacidad(mesaDetails.getCapacidad());
            mesaToUpdate.setUbicacion(mesaDetails.getUbicacion());
            return ResponseEntity.ok(mesaService.save(mesaToUpdate));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMesa(@PathVariable Integer id) {
        mesaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
