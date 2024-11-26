package com.flamabrava.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index"; // Esto devolverá un archivo index.html en /resources/templates o
                        // /resources/static
    }
}
