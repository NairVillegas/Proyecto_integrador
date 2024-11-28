package com.flamabrava.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "GESCATBL")
public class Categoria implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CCATID")
    private Integer id;

    @Column(name = "XCATNOM", length = 100, nullable = false)
    private String nombre;

    // Métodos Getter y Setter

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
