package com.flamabrava.service;

import com.flamabrava.model.Pedido;
import com.flamabrava.model.Cliente;
import com.flamabrava.repository.PedidoRepository;
import com.flamabrava.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> findById(Integer id) {
        return pedidoRepository.findById(id);
    }

    public Pedido save(Pedido pedido) {
        // Verificar si el cliente ya está persistido
        if (pedido.getCliente() != null && pedido.getCliente().getId() == null) {
            Cliente clientePersistido = clienteRepository.save(pedido.getCliente());
            pedido.setCliente(clientePersistido);
        }
        return pedidoRepository.save(pedido);
    }

    public void deleteById(Integer id) {
        pedidoRepository.deleteById(id);
    }
}
