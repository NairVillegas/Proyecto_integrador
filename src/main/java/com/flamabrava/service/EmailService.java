package com.flamabrava.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

 import jakarta.mail.MessagingException;
 import jakarta.mail.internet.MimeMessage;
@Service
public class EmailService {

  @Autowired
  private JavaMailSender mailSender;

  /**
   * Envía el mail de verificación de cuenta.
   * @param to   correo destino
   * @param token  token de verificación
   */
  public void sendVerificationEmail(String to, String token) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(to);
    msg.setSubject("Verifica tu cuenta en FlamaBrava");
    msg.setText(
      "Usa este Codigo para Verificar tu Cuenta en la Pagina FlamaBrava:\n" +token
    );
    mailSender.send(msg);
  }

  /**
   * Envía la boleta generada como PDF adjunto.
   * @param to     correo destino
   * @param pdf    bytes del PDF
   * @param id     id de la boleta/pedido
   */
  public void sendInvoiceEmail(String to, byte[] pdf, Long id) throws MessagingException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    helper.setTo(to);
    helper.setSubject("Tu boleta FlamaBrava #" + id);
    helper.setText("<p>Adjunto encontrarás tu boleta en PDF.</p>", true);
    helper.addAttachment("boleta-" + id + ".pdf", new ByteArrayResource(pdf));
    mailSender.send(message);
  }
}
