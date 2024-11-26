package com.flamabrava.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    @GetMapping("/api/mensaje")
    public String obtenerMensaje() {
        return "Hola desde el backend de Spring Boot";
    }
}
