package com.flamabrava.controller;

import com.flamabrava.model.Cliente;
import com.flamabrava.model.Usuario;
import com.flamabrava.service.ClienteService;
import com.flamabrava.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "https://polleriaflamabrava.netlify.app")
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private UsuarioService usuarioService;

    // -------------- CRUD BÁSICO ----------------

    @GetMapping
    public ResponseEntity<List<Cliente>> getAllClientes() {
        return ResponseEntity.ok(clienteService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Integer id) {
        return clienteService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> updateTelefono(
            @PathVariable Integer id,
            @RequestBody Cliente cliente) {
        return clienteService.updateTelefono(id, cliente.getTelefono())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Integer id) {
        if (clienteService.findById(id).isPresent()) {
            clienteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ---------------- AUTENTICACIÓN ----------------

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email      = credentials.get("email");
        String contrasena = credentials.get("contrasena");

        // Intentamos cliente primero
        Optional<Cliente> oc = clienteService.findByEmail(email);
        if (oc.isPresent()) {
            Cliente c = oc.get();
            if (!c.getEmailVerified()) {
                // Aún no ha confirmado su e-mail
                return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Debe verificar su correo antes de iniciar sesión");
            }
            if (c.getContrasena().equals(contrasena)) {
                c.setIsActive(true);
                clienteService.save(c);
                return ResponseEntity.ok(c);
            } else {
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Contraseña incorrecta");
            }
        }

        // Si no es cliente, intentamos usuario (admin)
        Optional<Usuario> ou = usuarioService.findByNombre(email);
        if (ou.isPresent()) {
            Usuario u = ou.get();
            if (u.getPassword().equals(contrasena)) {
                return ResponseEntity.ok(u);
            } else {
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Contraseña incorrecta");
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body("Falta el correo electrónico");
        }
        Optional<Cliente> oc = clienteService.findByEmail(email);
        if (oc.isPresent()) {
            Cliente c = oc.get();
            c.setIsActive(false);
            clienteService.save(c);
            return ResponseEntity.ok("Sesión cerrada correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Cliente no encontrado");
        }
    }

    // --------------- REGISTRO Y VERIFICACIÓN POR CORREO ----------------

    /**
     * Registra un nuevo cliente:
     * - comprueba duplicado por e-mail,
     * - genera token de verificación,
     * - guarda y envía correo.
     */
    @PostMapping
    public ResponseEntity<?> registerCliente(@RequestBody Cliente cliente) {
        // 1) evitar duplicados
        if (clienteService.findByEmail(cliente.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("Ya existe un cliente con ese correo");
        }
        // 2) delegar al servicio
        Cliente saved = clienteService.registerCliente(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Endpoint al que envía el correo:
     * GET /api/clientes/verify?token=XYZ
     */
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        try {
            clienteService.verifyEmailToken(token);
            return ResponseEntity.ok("Correo verificado correctamente");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Token inválido o expirado");
        }
    }
      @PostMapping("/verify-code")
  public ResponseEntity<?> verifyCode(@RequestBody Map<String,String> body) {
    String token = body.get("token");
    if (token == null || token.isBlank()) {
      return ResponseEntity
        .badRequest()
        .body(Map.of("message","Debe enviar un token de verificación"));
    }

    return clienteService.findByToken(token)
      .map(cliente -> {
        cliente.setEmailVerified(true);
        // opcional: limpiar el token para que no valga más:
        cliente.setVerificationToken(null);
        clienteService.save(cliente);
        return ResponseEntity.ok(Map.of(
          "message","Cuenta verificiada correctamente"
        ));
      })
      .orElseGet(() -> ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(Map.of("message","Token inválido o expirado"))
      );
  }


}
