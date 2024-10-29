package com.flamabrava.service;

import com.flamabrava.model.Reservacion;
import com.flamabrava.repository.ReservacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservacionService {

    @Autowired
    private ReservacionRepository reservacionRepository;

    public List<Reservacion> findAll() {
        return reservacionRepository.findAll();
    }

    public Optional<Reservacion> findById(Integer id) {
        return reservacionRepository.findById(id);
    }

    public Reservacion save(Reservacion reservacion) {
        return reservacionRepository.save(reservacion);
    }

    public void deleteById(Integer id) {
        reservacionRepository.deleteById(id);
    }
}
