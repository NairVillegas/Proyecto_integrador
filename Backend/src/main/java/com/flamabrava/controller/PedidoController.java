package com.flamabrava.controller;

import com.flamabrava.model.Pedido;
import com.flamabrava.repository.PedidoRepository;
import com.flamabrava.service.BoletaService;
import com.flamabrava.service.EmailService;
import com.flamabrava.service.PedidoService;
 import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://polleriaflamabrava.netlify.app",
    "https://flamabrava.onrender.com"
})
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;
  @Autowired
  private PedidoRepository pedidoRepository;

  @Autowired
  private BoletaService boletaService;

  @Autowired
  private EmailService emailService;
    /**
     * GET /api/pedidos
     * Devuelve todos los pedidos con su detalle.
     */
    @GetMapping
    public ResponseEntity<List<Map<String, ?>>> getAllPedidos() {
        List<Pedido> pedidos = pedidoService.findAll();
        List<Map<String, ?>> result = pedidos.stream()
            .map(p -> Map.<String, Object>of(
                "id",           p.getId(),
                "clienteId",    p.getCliente().getId(),
                "fechaPedido",  p.getFechaPedido(),
                "estado",       p.getEstado(),
                "total",        p.getTotal(),
                "detallesText", p.getDetalles()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/pedidos/{id}
     * Devuelve un pedido con su resumen textual y line items.
     */
     @GetMapping("/{id}")
  public ResponseEntity<Map<String, ?>> getPedidoById(@PathVariable Integer id) {
    Optional<Pedido> opt = pedidoService.findByIdWithDetalle(id);
    if (opt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    Pedido p = opt.get();

    Map<String, ?> respuesta = Map.<String, Object>of(
      "id",           p.getId(),
      "clienteId",    p.getCliente().getId(),
      "fechaPedido",  p.getFechaPedido(),
      "estado",       p.getEstado(),
      "total",        p.getTotal(),
      "detallesText", p.getDetalles(),
      "lineItems",    p.getDetalle().stream()
        .map(d -> Map.<String, Object>of(
          "productoId",     d.getProducto().getId(),
          "nombre",         d.getProducto().getNombre(),
          "cantidad",       d.getCantidad(),
          "precioUnitario", d.getProducto().getPrecio(),
          "totalLinea",     d.getTotal()
        ))
        .collect(Collectors.toList())
    );

    return ResponseEntity.ok(respuesta);
  }
@PostMapping("/{id}/send-invoice")
public ResponseEntity<?> sendInvoice(@PathVariable Integer id) {
  Pedido pedido = pedidoRepository.findById(id)
    .orElseThrow(() -> new ResponseStatusException(
      HttpStatus.NOT_FOUND, "Pedido no encontrado"));

  try {
    // Generar PDF (conversión a long si tu servicio lo pide)
    byte[] pdf = boletaService.generarBoleta(id.longValue());

    // Extraer correo del cliente
    String correoCliente = pedido.getCliente().getEmail(); 

    // Enviar correo
    emailService.sendInvoiceEmail(correoCliente, pdf, pedido.getId().longValue());

    return ResponseEntity.ok("Boleta enviada a " + correoCliente);
  } catch (Exception e) {
    return ResponseEntity
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body("Error al enviar la boleta: " + e.getMessage());
  }
}

    /**
     * DELETE /api/pedidos/{id}
     * Elimina un pedido y su detalle.
     */@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://polleriaflamabrava.netlify.app"
})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Integer id) {
        pedidoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
      @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarPedido(
            @PathVariable Integer id,
            @RequestBody Map<String,String> body) {

        String motivo = body.get("motivo");
        Optional<Pedido> opt = pedidoService.cancelarPedido(id, motivo);

        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Pedido actualizado = opt.get();
        // construimos la misma forma en que devolvemos en getAllPedidos
        Map<String,Object> resp = Map.of(
            "id",           actualizado.getId(),
            "clienteId",    actualizado.getCliente().getId(),
            "fechaPedido",  actualizado.getFechaPedido(),
            "estado",       actualizado.getEstado(),
            "total",        actualizado.getTotal(),
            "detallesText", actualizado.getDetalles(),
            "observaciones", actualizado.getObservaciones()  // nuevo campo
        );
        return ResponseEntity.ok(resp);
    }
     @PutMapping("/{id}")
  public ResponseEntity<?> changeEstado(
      @PathVariable Integer id,
      @RequestBody Map<String, String> body) {
    try {
      // 1) Busca el pedido (con detalle)
      Optional<Pedido> opt = pedidoService.findByIdWithDetalle(id);
      if (opt.isEmpty()) {
        return ResponseEntity.notFound().build();
      }
      Pedido p = opt.get();

      // 2) Actualiza el estado
      String nuevo = body.get("estado");
      if (nuevo == null || nuevo.isBlank()) {
        return ResponseEntity
          .badRequest()
          .body(Map.of("message", "Debe enviar un estado válido"));
      }
      p.setEstado(nuevo);
      pedidoService.save(p);  // guarda cambios

      // 3) Reconstruye el mismo Map de salida
      Map<String, ?> respuesta = Map.<String, Object>of(
        "id",           p.getId(),
        "clienteId",    p.getCliente().getId(),
        "fechaPedido",  p.getFechaPedido(),
        "estado",       p.getEstado(),
        "total",        p.getTotal(),
        "detallesText", p.getDetalles(),
        "lineItems",    p.getDetalle().stream()
          .map(d -> Map.<String, Object>of(
            "productoId",     d.getProducto().getId(),
            "nombre",         d.getProducto().getNombre(),
            "cantidad",       d.getCantidad(),
            "precioUnitario", d.getProducto().getPrecio(),
            "totalLinea",     d.getTotal()
          ))
          .collect(Collectors.toList())
      );

      return ResponseEntity.ok(respuesta);

    } catch (Exception e) {
      // imprime stacktrace para debugging
      e.printStackTrace();
      // y devuelve detalle en JSON (solo en dev)
      StringWriter sw = new StringWriter();
      e.printStackTrace(new PrintWriter(sw));
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(Map.<String, Object>of(
          "error", e.getClass().getSimpleName(),
          "message", e.getMessage(),
          "trace", sw.toString()
        ));
    }
  }
}

