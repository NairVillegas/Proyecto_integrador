package com.flamabrava.service;

import com.flamabrava.model.DetallePedido;
import com.flamabrava.repository.DetallePedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetallePedidoService {

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    public List<DetallePedido> findAll() {
        return detallePedidoRepository.findAll();
    }

    public Optional<DetallePedido> findById(Integer id) {
        return detallePedidoRepository.findById(id);
    }

    public DetallePedido save(DetallePedido detallePedido) {
        return detallePedidoRepository.save(detallePedido);
    }

    public void deleteById(Integer id) {
        detallePedidoRepository.deleteById(id);
    }
}
