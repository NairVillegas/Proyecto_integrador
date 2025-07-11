package com.flamabrava.controller;

import com.flamabrava.model.Cliente;
import com.flamabrava.model.Mesa;
import com.flamabrava.model.Reserva;
import com.flamabrava.repository.ReservaRepository;
import com.flamabrava.service.ClienteService;
import com.flamabrava.service.MesaService;
import com.flamabrava.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = { "https://polleriaflamabrava.netlify.app", "http://localhost:3000" })
public class ReservaController {

    @Autowired private ReservaService     reservaService;
    @Autowired private ReservaRepository  reservaRepository;
    @Autowired private MesaService        mesaService;
      @Autowired private ReservaRepository reservaRepo;

 @Autowired
private ClienteService clienteService;

 @GetMapping
  public ResponseEntity<List<Reserva>> getAllReservas() {
    List<Reserva> list = reservaRepo.findAll();

    list.forEach(r -> {
      // Busca el cliente por su ID y ponlo en el campo "transient" cliente
      clienteService.findById(r.getIdUsuario())
                    .ifPresent(r::setCliente);
      // opcionalmente podrías hacer:
      // .orElse(r.setCliente(new Cliente())) para que nunca sea null
    });

    return ResponseEntity.ok(list);
  }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getReservaById(@PathVariable Integer id) {
        return reservaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** 
     * GET /api/reservas/aforo?fechaInicio=YYYY-MM-DDTHH:mm:ss 
     * → { "aforoRestante": NN }
     */
  // src/main/java/com/flamabrava/controller/ReservaController.java

    /**
     * GET /api/reservas/aforo
     * Parámetros:
     *   - fechaInicio: YYYY-MM-DDTHH:mm:ss
     *   - fechaFin:    YYYY-MM-DDTHH:mm:ss
     *
     * Devuelve { "aforoRestante": NN }
     */
 @GetMapping("/aforo")
  public ResponseEntity<Map<String,Integer>> getAforoRango(
      @RequestParam String fechaInicio,
      @RequestParam String fechaFin
  ) {
    LocalDateTime inicio = LocalDateTime.parse(fechaInicio);
    LocalDateTime fin    = LocalDateTime.parse(fechaFin);

    int ocupadas    = reservaService.sumarPersonasEnRango(inicio, fin);
    int aforoMaximo = reservaService.getAforoMaximo();
    int restante    = Math.max( aforoMaximo - ocupadas, 0 );

    return ResponseEntity.ok(Map.of("aforoRestante",restante));
  }



   @PostMapping
public ResponseEntity<Map<String,Object>> createReserva(
        @RequestBody Reserva reserva
) {
    // 1) Validaciones
    if (reserva.getIdUsuario()    == null ||
        reserva.getMesa()         == null ||
        reserva.getFechaInicio()  == null ||
        reserva.getFechaFin()     == null ||
        reserva.getNumPersonas()  == null) {
        return ResponseEntity
            .badRequest()
            .body(Map.of(
                "error",
                "idUsuario, mesa, fechaInicio, fechaFin y numPersonas son obligatorios"
            ));
    }

    // 2) Verificar que la mesa exista
    Mesa mesa = mesaService
            .findById(reserva.getMesa().getId())
            .orElseThrow(() -> new IllegalArgumentException("Mesa no existe"));
    reserva.setMesa(mesa);

    // 3) Estado y observaciones por defecto
    if (reserva.getEstado() == null)         reserva.setEstado("Pendiente");
    if (reserva.getObservaciones() == null)  reserva.setObservaciones("");

    // 4) Guardar la reserva
    Reserva guardada = reservaRepository.save(reserva);

    // 5) Calcular aforo en TODO el rango [fechaInicio, fechaFin)
    LocalDateTime inicio = guardada.getFechaInicio();
    LocalDateTime fin    = guardada.getFechaFin();

    // a) cuántas personas ya hay reservadas que tocan ese intervalo
    int ocupadas = reservaService.sumarPersonasEnRango(inicio, fin);
    // b) capacidad total
    int aforoMax  = reservaService.getAforoMaximo();
    // c) lo que queda libre
    int restante  = Math.max(aforoMax - ocupadas, 0);

    // 6) Responder con la reserva y el nuevo aforo
    Map<String,Object> resp = new HashMap<>();
    resp.put("reserva",        guardada);
    resp.put("aforoRestante", restante);
    return ResponseEntity.ok(resp);
}


    @PutMapping("/{id}")
    public ResponseEntity<Reserva> updateReserva(
            @PathVariable Integer id,
            @RequestBody Reserva detalles
    ) {
        return reservaRepository.findById(id)
            .map(r -> {
                r.setIdUsuario(detalles.getIdUsuario());
                r.setMesa(detalles.getMesa());
                r.setFechaInicio(detalles.getFechaInicio());
                r.setFechaFin(detalles.getFechaFin());
                r.setNumPersonas(detalles.getNumPersonas());
                r.setObservaciones(detalles.getObservaciones());
                return ResponseEntity.ok(reservaRepository.save(r));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Reserva> cancelarReserva(@PathVariable Integer id) {
        return reservaRepository.findById(id)
            .map(r -> {
                // 1) Cambiar estado
                r.setEstado("Cancelado");
                // 2) Liberar mesa
                Mesa m = r.getMesa();
                if (m != null) {
                    m.setEstado("Libre");
                    mesaService.save(m);
                }
                // 3) Guardar y devolver
                Reserva actualizado = reservaRepository.save(r);
                return ResponseEntity.ok(actualizado);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
