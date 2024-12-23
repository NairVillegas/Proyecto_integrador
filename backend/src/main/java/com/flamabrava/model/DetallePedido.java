package com.flamabrava.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "GESDETTBL")
public class DetallePedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CDETID")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "CPEDID")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "CPROID")
    private Producto producto;

    @Column(name = "NDETCNT", nullable = false)
    private Integer cantidad;

    @Column(name = "NDETTOT", precision = 10, scale = 2, nullable = false)
    private BigDecimal total;

    // Metodos Getter y Setter

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
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

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
