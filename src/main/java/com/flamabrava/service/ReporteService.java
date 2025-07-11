package com.flamabrava.service;

import com.flamabrava.model.Cliente;
import com.flamabrava.model.Pedido;
import com.flamabrava.model.Reserva;
import com.flamabrava.repository.PedidoRepository;
import com.flamabrava.repository.ReservaRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PiePlot;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Stream;

@Service
public class ReporteService {

    @Autowired private ReservaRepository reservaRepo;
    @Autowired private PedidoRepository  pedidoRepo;
    @Autowired private ClienteService    clienteService;
    @Autowired private ResourceLoader    resourceLoader;

    private static final DateTimeFormatter FMT_FECHA_HORA = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final DateTimeFormatter FMT_META = 
        DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /** Sobrecarga para cuando no pasan username */
    public byte[] generarReporteCompleto() throws Exception {
        return generarReporteCompleto("desconocido");
    }

    /** El verdadero método, recibe el nombre de usuario */
    public byte[] generarReporteCompleto(String username) throws Exception {
        List<Reserva> reservas = reservaRepo.findAll();
        List<Pedido>  pedidos  = pedidoRepo.findAll();

        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        // ► 1) Logo
        // Se carga como "classpath:images/logoflamabrava.png"
        try {
            Resource logoRes = resourceLoader.getResource("classpath:images/logoflamabrava.png");
            if (logoRes.exists()) {
                try (InputStream is = logoRes.getInputStream()) {
                    BufferedImage awtImg = ImageIO.read(is);
                    Image logo = Image.getInstance(awtImg, null);
                    logo.setAlignment(Element.ALIGN_CENTER);
                    logo.scaleToFit(150, 75);
                    document.add(logo);
                    document.add(Chunk.NEWLINE);
                }
            } else {
                // opción borrosa: document.add(new Paragraph("LOGO NO ENCONTRADO"));
            }
        } catch (Exception e) {
            // Si falla, no rompe todo
            e.printStackTrace();
        }

        // ► 2) Fecha y usuario
        String timestamp = LocalDateTime.now().format(FMT_META);
        Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Font.ITALIC);
        Paragraph meta = new Paragraph(
            String.format("Generado: %s    Usuario: %s", timestamp, username),
            metaFont
        );
        meta.setAlignment(Element.ALIGN_RIGHT);
        document.add(meta);
        document.add(Chunk.NEWLINE);

        // ► 3) Título
        Font fTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        document.add(new Paragraph("REPORTE DE RESERVAS Y VENTAS", fTitulo));
        document.add(Chunk.NEWLINE);

        Font fNormal = FontFactory.getFont(FontFactory.HELVETICA, 10);

        // ► 4) Tabla de Reservas
        PdfPTable t1 = new PdfPTable(8);
        t1.setWidthPercentage(100);
        Stream.of("ID","Cliente","DNI","Teléfono","Correo","Mesa","Inicio","Fin")
              .forEach(h -> {
                  PdfPCell c = new PdfPCell(new Phrase(h, fNormal));
                  c.setBackgroundColor(BaseColor.LIGHT_GRAY);
                  c.setHorizontalAlignment(Element.ALIGN_CENTER);
                  t1.addCell(c);
              });
        for (Reserva r : reservas) {
            Cliente c = clienteService.findById(r.getIdUsuario()).orElse(new Cliente(0));
            t1.addCell(r.getId().toString());
            t1.addCell(c.getNombre());
            t1.addCell(c.getDni());
            t1.addCell(c.getTelefono());
            t1.addCell(c.getEmail());
            t1.addCell(String.valueOf(r.getMesa().getNumero()));
            t1.addCell(r.getFechaInicio().format(FMT_FECHA_HORA));
            t1.addCell(r.getFechaFin().format(FMT_FECHA_HORA));
        }
        document.add(t1);
        document.add(Chunk.NEWLINE);

        // ► 5) Gráficos de Reservas
        generarPieChart(document, reservas, 7, 12, "Reservas Jul–Dic", fNormal);
        generarPieChart(document, reservas, 1,  6, "Reservas Ene–Jun", fNormal);
        generarPieChartAnual(document, reservas, fNormal);
        generarPieChartGeneral(document, reservas, fNormal);

        // ► 6) Reporte de Ventas
        document.newPage();
        document.add(new Paragraph("REPORTE DE VENTAS", fTitulo));
        document.add(Chunk.NEWLINE);

        int totalPedidos = pedidos.size();
        double ingresosTot = pedidos.stream()
                                    .mapToDouble(p -> p.getTotal().doubleValue())
                                    .sum();
        double ingresoMedio = totalPedidos > 0
                            ? ingresosTot / totalPedidos
                            : 0;
        Paragraph resumen = new Paragraph(
            String.format(
              "Total pedidos: %d   Ingresos totales: S/ %.2f   Ingreso medio: S/ %.2f",
              totalPedidos, ingresosTot, ingresoMedio
            ),
            fNormal
        );
        resumen.setAlignment(Element.ALIGN_CENTER);
        document.add(resumen);
        document.add(Chunk.NEWLINE);

        PdfPTable t2 = new PdfPTable(6);
        t2.setWidthPercentage(100);
        Stream.of("ID","Cliente","Total","Fecha","Estado","Detalle")
              .forEach(h -> {
                  PdfPCell c = new PdfPCell(new Phrase(h, fNormal));
                  c.setBackgroundColor(BaseColor.LIGHT_GRAY);
                  c.setHorizontalAlignment(Element.ALIGN_CENTER);
                  t2.addCell(c);
              });
        for (Pedido p : pedidos) {
            Cliente c2 = p.getCliente() != null ? p.getCliente() : new Cliente(0);
            t2.addCell(p.getId().toString());
            t2.addCell(c2.getNombre());
            t2.addCell("S/ " + p.getTotal().setScale(2));
            t2.addCell(
              p.getFechaPedido()
               .toInstant()
               .atZone(ZoneId.systemDefault())
               .toLocalDateTime()
               .format(FMT_FECHA_HORA)
            );
            t2.addCell(p.getEstado());
            String det = (p.getDetalles() == null || p.getDetalles().isBlank())
                       ? "-"
                       : p.getDetalles();
            PdfPCell dc = new PdfPCell(new Phrase(det, fNormal));
            dc.setNoWrap(false);
            t2.addCell(dc);
        }
        document.add(t2);

        document.close();
        return baos.toByteArray();
    }

    // — Métodos auxiliares para gráficos —

    private void generarPieChart(Document doc, List<Reserva> list,
                                 int mesDesde, int mesHasta,
                                 String titulo, Font fNorm) throws Exception {
        long total = list.stream()
                   .filter(r -> {
                       int m = r.getFechaInicio().getMonthValue();
                       return m >= mesDesde && m <= mesHasta;
                   }).count();
        long ex = list.stream()
                   .filter(r -> {
                       int m = r.getFechaInicio().getMonthValue();
                       return m >= mesDesde && m <= mesHasta
                           && "exitoso".equalsIgnoreCase(r.getEstado());
                   }).count();
        long ca = list.stream()
                   .filter(r -> {
                       int m = r.getFechaInicio().getMonthValue();
                       return m >= mesDesde && m <= mesHasta
                           && "cancelado".equalsIgnoreCase(r.getEstado());
                   }).count();
        long pe = total - ex - ca;

        DefaultPieDataset ds = new DefaultPieDataset();
        ds.setValue("Exitosos", ex);
        ds.setValue("Cancelados", ca);
        ds.setValue("Pendientes", pe);

        JFreeChart chart = ChartFactory.createPieChart(titulo, ds, true, false, false);
        PiePlot plot = (PiePlot) chart.getPlot();
        plot.setSectionPaint("Exitosos", new Color(34,139,34));
        plot.setSectionPaint("Cancelados", Color.RED);
        plot.setSectionPaint("Pendientes", Color.GRAY);

        addChartToDoc(doc, chart, 400, 300);
        addPercentText(doc, ex, ca, pe, total, fNorm);
    }

    private void generarPieChartAnual(Document doc, List<Reserva> list, Font fNorm) throws Exception {
        int year = LocalDateTime.now().getYear();
        long total = list.stream().filter(r -> r.getFechaInicio().getYear() == year).count();
        long ex    = list.stream()
                    .filter(r -> r.getFechaInicio().getYear() == year
                              && "exitoso".equalsIgnoreCase(r.getEstado()))
                    .count();
        long ca    = list.stream()
                    .filter(r -> r.getFechaInicio().getYear() == year
                              && "cancelado".equalsIgnoreCase(r.getEstado()))
                    .count();
        long pe    = total - ex - ca;

        DefaultPieDataset ds = new DefaultPieDataset();
        ds.setValue("Exitosos", ex);
        ds.setValue("Cancelados", ca);
        ds.setValue("Pendientes", pe);

        JFreeChart chart = ChartFactory.createPieChart("Reservas Año " + year, ds, true, false, false);
        PiePlot plot = (PiePlot) chart.getPlot();
        plot.setSectionPaint("Exitosos", new Color(34,139,34));
        plot.setSectionPaint("Cancelados", Color.RED);
        plot.setSectionPaint("Pendientes", Color.GRAY);

        addChartToDoc(doc, chart, 400, 300);
        addPercentText(doc, ex, ca, pe, total, fNorm);
    }

    private void generarPieChartGeneral(Document doc, List<Reserva> list, Font fNorm) throws Exception {
        long total = list.size();
        long ex    = list.stream().filter(r -> "exitoso".equalsIgnoreCase(r.getEstado())).count();
        long ca    = list.stream().filter(r -> "cancelado".equalsIgnoreCase(r.getEstado())).count();
        long pe    = total - ex - ca;

        DefaultPieDataset ds = new DefaultPieDataset();
        ds.setValue("Exitosos", ex);
        ds.setValue("Cancelados", ca);
        ds.setValue("Pendientes", pe);

        JFreeChart chart = ChartFactory.createPieChart("Reservas Generales", ds, true, false, false);
        PiePlot plot = (PiePlot) chart.getPlot();
        plot.setSectionPaint("Exitosos", new Color(34,139,34));
        plot.setSectionPaint("Cancelados", Color.RED);
        plot.setSectionPaint("Pendientes", Color.GRAY);

        addChartToDoc(doc, chart, 400, 300);
        addPercentText(doc, ex, ca, pe, total, fNorm);
    }

    private void addChartToDoc(Document doc, JFreeChart chart, int w, int h) throws Exception {
        BufferedImage img = chart.createBufferedImage(w, h);
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(img, "png", bos);
        Image itext = Image.getInstance(bos.toByteArray());
        itext.setAlignment(Element.ALIGN_CENTER);
        itext.scaleToFit(w, h);
        doc.add(Chunk.NEWLINE);
        doc.add(itext);
    }

    private void addPercentText(Document doc,
                                long ex, long ca, long pe, long tot,
                                Font f) throws DocumentException {
        doc.add(Chunk.NEWLINE);
        String txt = String.format(
          "Exitosos: %d (%.1f%%)   Cancelados: %d (%.1f%%)   Pendientes: %d (%.1f%%)",
          ex, tot>0 ? ex*100.0/tot : 0,
          ca, tot>0 ? ca*100.0/tot : 0,
          pe, tot>0 ? pe*100.0/tot : 0
        );
        Paragraph p = new Paragraph(txt, f);
        p.setAlignment(Element.ALIGN_CENTER);
        doc.add(p);
    }
}
