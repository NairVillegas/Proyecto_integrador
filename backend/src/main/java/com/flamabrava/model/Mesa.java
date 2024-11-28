package com.flamabrava.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "GESMESTBL")
public class Mesa implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CMESID")
    private Integer id;

    @Column(name = "NMESNUM", nullable = false)
    private Integer numero;

    @Column(name = "NMESCAP", nullable = false)
    private Integer capacidad;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }
}
