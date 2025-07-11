package com.flamabrava.repository;

import com.flamabrava.model.Mesa;
import com.flamabrava.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.List;


@Repository
@CrossOrigin(origins = "https://polleriaflamabrava.netlify.app")
public interface MesaRepository extends JpaRepository<Mesa, Integer> {

    /**
     * Devuelve todas las mesas que:
     *  - tienen capacidad = :numPersonas
     *  - y cuyo id NO está en la subconsulta de mesas reservadas
     *    en el intervalo [horaInicio, horaFin)
     *
     * horario “en punto” significa minutos=0, segundos=0
     */
  @Query("""
    SELECT m
      FROM Mesa m
     WHERE m.capacidad = :numPersonas
       AND m.id NOT IN (
         SELECT r.mesa.id
           FROM Reserva r
          WHERE r.fechaInicio <  :fechaFin
            AND r.fechaFin   >  :fechaInicio
            AND r.estado     <> 'cancelada'
      )
  """)
  List<Mesa> findMesasDisponiblesExactas(
    @Param("fechaInicio") LocalDateTime fechaInicio,
    @Param("fechaFin")    LocalDateTime fechaFin,
    @Param("numPersonas") Integer numPersonas
  );
}