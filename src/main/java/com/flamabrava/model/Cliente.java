package com.flamabrava.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "GESCLITBL")
public class Cliente implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CCLIID")
    private Integer id;

    @Column(name = "XCLINOM", length = 50, nullable = false)
    private String nombre;

    @Column(name = "XCLIAPL", length = 50, nullable = false)
    private String apellido;

    @Column(name = "XCLIEML", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "XCLITLF", length = 9)
    private String telefono;

    @Column(name = "XCLIDIR", length = 150)
    private String direccion;

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

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}
