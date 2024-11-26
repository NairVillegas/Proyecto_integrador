package com.flamabrava.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "GESPEDTBL")
public class Pedido implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CPEDID")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "CCLIID", nullable = false)
    private Cliente cliente;

    @Column(name = "FPEDFECHA", nullable = false)
    private Date fechaPedido;

    @Column(name = "XPEDSTA", length = 20, nullable = false)
    private String estado;

    @Column(name = "NPEDTOT")
    private Double total;

    // Métodos Getter y Setter

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Date getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(Date fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
