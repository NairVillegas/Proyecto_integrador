package com.flamabrava.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "GESUSRTBL")
public class Usuario implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CUSRID")
    private Integer id;

    @Column(name = "XUSRNOM", length = 50, nullable = false)
    private String nombre;

    @Column(name = "XUSRPWD", length = 100, nullable = false)
    private String password;

    @Column(name = "XUSRROL", length = 20)
    private String rol;

    @Column(name = "FUSRFECHA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaCreacion = new Date();

    // Metodos Getter y Setter

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
