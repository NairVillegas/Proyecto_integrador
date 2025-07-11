package com.flamabrava.controller;

import com.flamabrava.model.Pedido;
import com.flamabrava.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://polleriaflamabrava.netlify.app"
})
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

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

    /**
     * DELETE /api/pedidos/{id}
     * Elimina un pedido y su detalle.
     */
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
}
