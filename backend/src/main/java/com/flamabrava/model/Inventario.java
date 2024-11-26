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

    @Column(name = "NINVCNT", nullable = false)
    private Integer cantidad;

    @Column(name = "XINVMOV", length = 50, nullable = false)
    private String movimiento;

    @Column(name = "FINVFECHA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaMovimiento = new Date();

    // Metodos Getter y Setter

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

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public String getMovimiento() {
        return movimiento;
    }

    public void setMovimiento(String movimiento) {
        this.movimiento = movimiento;
    }

    public Date getFechaMovimiento() {
        return fechaMovimiento;
    }

    public void setFechaMovimiento(Date fechaMovimiento) {
        this.fechaMovimiento = fechaMovimiento;
    }
}
