package com.flamabrava.service;

import com.flamabrava.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class ReservaService {

    private static final int AFORO_MAXIMO = 30;

    @Autowired
    private ReservaRepository reservaRepository;

    /**
     * (Opcional) Método legacy que trunca a hora en punto y devuelve
     * el aforo restante en esa hora.
     */
    @Transactional(readOnly = true)
    public int obtenerAforoRestante(LocalDateTime fechaHoraOriginal) {
        LocalDateTime inicio = fechaHoraOriginal.truncatedTo(ChronoUnit.HOURS);
        LocalDateTime fin    = inicio.plusHours(1);
        Integer total = reservaRepository.sumPersonasEnRango(inicio, fin);
        if (total == null) total = 0;
        int restante = AFORO_MAXIMO - total;
        return Math.max(0, restante);
    }

    /**
     * Suma todas las plazas reservadas cuyo intervalo [fechaInicio, fechaFin)
     * se solape con el rango proporcionado.
     */
    @Transactional(readOnly = true)
    public int sumarPersonasEnRango(LocalDateTime inicio, LocalDateTime fin) {
        Integer total = reservaRepository.sumPersonasEnRango(inicio, fin);
        return total == null ? 0 : total;
    }

    /**
     * Devuelve la capacidad máxima del restaurante.
     */
    public int getAforoMaximo() {
        return AFORO_MAXIMO;
    }
}
