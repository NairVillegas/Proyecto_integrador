package com.flamabrava.repository;

import com.flamabrava.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

    /**
     * Suma el numPersonas de todas las reservas cuyo inicio
     * esté dentro del intervalo [horaInicio, horaFin),
     * y cuyo estado no sea "cancelada".
     */
    @Query("""
      select coalesce(sum(r.numPersonas),0)
        from Reserva r
       where r.fechaInicio <  :fin
         and r.fechaFin   >  :inicio
         and r.estado <> 'cancelada'
    """)
    Integer sumPersonasEnRango(
      @Param("inicio") LocalDateTime inicio,
      @Param("fin")    LocalDateTime fin
    );
}
