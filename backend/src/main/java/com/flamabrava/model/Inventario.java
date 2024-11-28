package com.flamabrava.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "GESINVTBL")
public class Inventario implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CINVID")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "CPROID", nullable = false)
    private Producto producto;

    @Column(name = "FINVFECHA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaMovimiento = new Date();

    // Métodos Getter y Setter

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Date getFechaMovimiento() {
        return fechaMovimiento;
    }

    public void setFechaMovimiento(Date fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
    }
}
