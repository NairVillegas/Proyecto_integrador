package com.flamabrava.controller;

import com.flamabrava.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/aforo")
@CrossOrigin(origins = "https://polleriaflamabrava.netlify.app") // No borrés tu CORS
public class AforoController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> obtenerAforo(
            @RequestParam("fecha")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHora) {

        // 1) Calculamos cuántas plazas quedan
        int restante = reservaService.obtenerAforoRestante(fechaHora);

        // 2) Preparamos la respuesta
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("fecha", fechaHora);
        respuesta.put("aforoRestante", restante);

        return ResponseEntity.ok(respuesta);
    }
}