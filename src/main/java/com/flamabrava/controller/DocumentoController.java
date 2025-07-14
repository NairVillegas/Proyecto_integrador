package com.flamabrava.controller;

import com.flamabrava.model.Pedido;
import com.flamabrava.service.PedidoService;
import com.flamabrava.service.ReporteService;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Optional;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = {
    "https://polleriaflamabrava.netlify.app",
    "http://localhost:3000"
})
public class DocumentoController {

    @Autowired
    private PedidoService pedidoService;
    @Autowired
    private ReporteService reporteService;

    // --- Constantes de Diseño ---
    private static final float PAGE_WIDTH = 226;
    private static final float PAGE_HEIGHT = 850; // Altura aumentada para el QR
    private static final float MARGIN = 10;
    
    private static final float LINE_HEIGHT = 12;
    private static final float SECTION_GAP = 18;
    private static final float SMALL_GAP = 5;

    private static final PDType1Font FONT_BOLD = PDType1Font.HELVETICA_BOLD;
    private static final PDType1Font FONT_REGULAR = PDType1Font.HELVETICA;
    private static final PDType1Font FONT_OBLIQUE = PDType1Font.HELVETICA_OBLIQUE;


    @GetMapping("/boleta/{pedidoId}")
    public void descargarBoleta(@PathVariable Integer pedidoId, HttpServletResponse response) throws IOException {
        Pedido pedido = pedidoService.findByIdWithDetalle(pedidoId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));

        response.setContentType("application/pdf");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=boleta_" + pedidoId + ".pdf");

        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(new PDRectangle(PAGE_WIDTH, PAGE_HEIGHT));
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                float yPosition = PAGE_HEIGHT - MARGIN;

                yPosition = drawLogo(doc, cs, yPosition);
                yPosition = drawHeader(cs, yPosition, pedido);
                yPosition = drawClientDetails(cs, yPosition, pedido);
                yPosition = drawItemsTable(cs, yPosition, pedido);
                yPosition = drawFooter(cs, yPosition, pedido);
                drawQRCode(doc, cs, yPosition); // <-- SE AÑADE EL QR AL FINAL

            } catch (Exception e) {
                e.printStackTrace();
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al generar la boleta");
            }

            doc.save(response.getOutputStream());
        }
    }

    private float drawLogo(PDDocument doc, PDPageContentStream cs, float y) throws IOException {
        try (InputStream in = getClass().getResourceAsStream("/images/logoflamabravas.png")) {
            if (in == null) {
                System.err.println("Advertencia: No se pudo encontrar el logo en 'resources/images/'.");
                return y;
            }
            PDImageXObject pdImage = PDImageXObject.createFromByteArray(doc, in.readAllBytes(), "logo");

            float logoWidth = 104;
            float logoHeight = 52;
            float x = (PAGE_WIDTH - logoWidth) / 2;
            float logoY = y - logoHeight;
            cs.drawImage(pdImage, x, logoY, logoWidth, logoHeight);
            
            return logoY - SECTION_GAP;
        } catch (IOException e) {
            System.err.println("Advertencia: Error al cargar el logo. Se omitirá. " + e.getMessage());
            return y;
        }
    }

    private float drawHeader(PDPageContentStream cs, float y, Pedido pedido) throws IOException {
        drawTextCentered(cs, "FLAMABRAVA S.A.C.", FONT_BOLD, 12, y);
        y -= LINE_HEIGHT;
        drawTextCentered(cs, "RUC: 20512345678", FONT_REGULAR, 8, y);
        y -= SECTION_GAP;

        drawTextCentered(cs, "BOLETA DE VENTA ELECTRÓNICA", FONT_BOLD, 10, y);
        y -= LINE_HEIGHT;

        String serie = "BE01";
        String numero = String.format("%06d", pedido.getId());
        drawTextCentered(cs, "Serie: " + serie + " - N° " + numero, FONT_REGULAR, 8, y);
        y -= SECTION_GAP;

        return y;
    }

    private float drawClientDetails(PDPageContentStream cs, float y, Pedido pedido) throws IOException {
        cs.setFont(FONT_REGULAR, 8);
        final float labelX = MARGIN;
        final float valueX = MARGIN + 65;

        String nombreCompleto = (getCleanedString(pedido.getCliente().getNombre(), "") + " " +
                                 getCleanedString(pedido.getCliente().getApellido(), "")).trim();
        SimpleDateFormat fmt = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

        drawTwoColumns(cs, "Fecha Emisión:", fmt.format(pedido.getFechaPedido()), y, labelX, valueX);
        y -= LINE_HEIGHT;
        drawTwoColumns(cs, "Cliente:", nombreCompleto, y, labelX, valueX);
        y -= LINE_HEIGHT;
        drawTwoColumns(cs, "DNI/RUC:", getCleanedString(pedido.getCliente().getDni(), ""), y, labelX, valueX);
        y -= LINE_HEIGHT;
        drawTwoColumns(cs, "Correo:", getCleanedString(pedido.getCliente().getEmail(), ""), y, labelX, valueX);
        y -= LINE_HEIGHT;
        drawTwoColumns(cs, "Teléfono:", getCleanedString(pedido.getCliente().getTelefono(), ""), y, labelX, valueX);
        y -= SECTION_GAP;

        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN);
        y -= SMALL_GAP;

        return y;
    }

    private float drawItemsTable(PDPageContentStream cs, float y, Pedido pedido) throws IOException {
        y -= LINE_HEIGHT;

        cs.beginText();
        cs.setFont(FONT_BOLD, 8);
        cs.newLineAtOffset(MARGIN, y);
        cs.showText("Cant.   Descripción");
        cs.endText();
        y -= (LINE_HEIGHT + SMALL_GAP);

        cs.setFont(FONT_REGULAR, 8);
        String detalles = pedido.getDetalles();
        if (detalles != null && !detalles.isBlank()) {
            String[] items = detalles.split("\\s*,\\s*");
            for (String item : items) {
                drawText(cs, formatItemLine(item), MARGIN, y);
                y -= LINE_HEIGHT;
            }
        } else {
            drawText(cs, "No hay productos en este pedido.", MARGIN, y);
            y -= LINE_HEIGHT;
        }

        y -= SMALL_GAP;
        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN);
        y -= SMALL_GAP;

        return y;
    }

    private float drawFooter(PDPageContentStream cs, float y, Pedido pedido) throws IOException {
        y -= SECTION_GAP;
        
        String totalText = "TOTAL: S/ " + pedido.getTotal().setScale(2);
        float textWidth = FONT_BOLD.getStringWidth(totalText) / 1000 * 12;
        cs.setFont(FONT_BOLD, 12);
        drawText(cs, totalText, PAGE_WIDTH - MARGIN - textWidth, y);
        y -= (SECTION_GAP + SMALL_GAP);

        drawTextCentered(cs, "¡Gracias por su preferencia!", FONT_OBLIQUE, 9, y);
        y -= LINE_HEIGHT;
        drawTextCentered(cs, "www.flamabrava.com", FONT_REGULAR, 7, y);
        y -= SECTION_GAP; // Espacio antes del QR
        
        return y;
    }

    /**
     * Dibuja el código QR en la parte inferior del documento.
     */
    private void drawQRCode(PDDocument doc, PDPageContentStream cs, float y) throws IOException {
        try (InputStream in = getClass().getResourceAsStream("/images/QR.png")) {
            if (in == null) {
                System.err.println("Advertencia: No se pudo encontrar el QR en 'resources/images/'.");
                return;
            }
            PDImageXObject pdImage = PDImageXObject.createFromByteArray(doc, in.readAllBytes(), "qr");

            float qrSize = 65; // Tamaño del QR
            float x = (PAGE_WIDTH - qrSize) / 2;
            float qrY = y - qrSize; // Posición 'y' desde la esquina inferior
            
            cs.drawImage(pdImage, x, qrY, qrSize, qrSize);

        } catch (IOException e) {
            System.err.println("Advertencia: Error al cargar el QR. Se omitirá. " + e.getMessage());
        }
    }
    
    // --- MÉTODOS UTILITARIOS ---

    private void drawText(PDPageContentStream cs, String text, float x, float y) throws IOException {
        cs.beginText();
        cs.newLineAtOffset(x, y);
        cs.showText(text);
        cs.endText();
    }
    
    private void drawTextCentered(PDPageContentStream cs, String text, PDType1Font font, int fontSize, float y) throws IOException {
        cs.setFont(font, fontSize);
        float textWidth = font.getStringWidth(text) / 1000f * fontSize;
        float x = (PAGE_WIDTH - textWidth) / 2f;
        drawText(cs, text, x, y);
    }

    private void drawTwoColumns(PDPageContentStream cs, String left, String right, float y, float x1, float x2) throws IOException {
        drawText(cs, left, x1, y);
        drawText(cs, right, x2, y);
    }
    
    private void drawLine(PDPageContentStream cs, float xStart, float y, float xEnd) throws IOException {
        cs.moveTo(xStart, y);
        cs.lineTo(xEnd, y);
        cs.setLineWidth(0.5f);
        cs.stroke();
    }

    private String getCleanedString(String input, String defaultValue) {
        if (input == null || input.isBlank()) return defaultValue;
        String cleaned = input.replaceAll("[^\\x00-\\x7F]", "");
        return cleaned.length() > 25 ? cleaned.substring(0, 22) + "..." : cleaned;
    }

    private String formatItemLine(String item) {
        String[] parts = item.split("x\\s*", 2);
        if (parts.length == 2) {
            String quantity = parts[0] + "x";
            String description = parts[1];
            if (description.length() > 22) {
                description = description.substring(0, 19) + "...";
            }
            return String.format("%-6s %s", quantity, description);
        }
        return item;
    }

    @GetMapping("/reporte")
    public ResponseEntity<byte[]> descargarReporte(@RequestParam(name = "usuario", required = false) String usuario) throws Exception {
        byte[] pdfBytes = (usuario == null || usuario.isBlank())
            ? reporteService.generarReporteCompleto()
            : reporteService.generarReporteCompleto(usuario);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"reporte.pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdfBytes);
    }
}
