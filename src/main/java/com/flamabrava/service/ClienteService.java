package com.flamabrava.service;

import com.flamabrava.model.Cliente;
import com.flamabrava.repository.ClienteRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@CrossOrigin(origins = "https://polleriaflamabrava.netlify.app")
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private EmailService emailService;
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> findById(Integer id) {
        return clienteRepository.findById(id);
    }

    public void deleteById(Integer id) {
        clienteRepository.deleteById(id);
    }

    public Cliente save(Cliente cliente) {
        if (cliente.getRol() == null || cliente.getRol().isEmpty()) {
            cliente.setRol("Cliente");
        }
        return clienteRepository.save(cliente);
    }

    public Optional<Cliente> findByEmail(String email) {
        return clienteRepository.findByEmail(email);
    }

    public Optional<Cliente> updateTelefono(Integer id, String telefono) {
        Optional<Cliente> cliente = clienteRepository.findById(id);

        if (cliente.isPresent()) {
            Cliente existingCliente = cliente.get();
            if (telefono != null && !telefono.isEmpty()) {
                existingCliente.setTelefono(telefono);
                clienteRepository.save(existingCliente);
                return Optional.of(existingCliente);
            }
        }
        return Optional.empty();
    }
      @Transactional
    public Cliente registerCliente(Cliente cliente) {
        // Asegura rol por defecto
        if (cliente.getRol() == null || cliente.getRol().isEmpty()) {
            cliente.setRol("Cliente");
        }
        // Usuario no está aún verificado
        cliente.setEmailVerified(false);

        // Generar token único
String token = UUID.randomUUID().toString().substring(0, 8);  // 8 caracteres
cliente.setVerificationToken(token);

        // Guardar en la base de datos
        Cliente saved = clienteRepository.save(cliente);

        // Enviar correo de verificación
        String recipient = saved.getEmail();
        emailService.sendVerificationEmail(recipient, token);

        return saved;
    }
      /**
     * Verifica un cliente por token: lo activa y borra el token.
     * @throws IllegalArgumentException si el token no existe.
     */
    @Transactional
    public void verifyEmailToken(String token) {
        Cliente cliente = clienteRepository
            .findByVerificationToken(token)
            .orElseThrow(() -> new IllegalArgumentException("Token inválido"));

        cliente.setEmailVerified(true);
        cliente.setVerificationToken(null);

        clienteRepository.save(cliente);
    }
      public Optional<Cliente> findByToken(String token) {
    return clienteRepository.findByVerificationToken(token);
  }
}
