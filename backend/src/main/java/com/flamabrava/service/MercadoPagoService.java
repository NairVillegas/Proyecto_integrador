package com.flamabrava.service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MercadoPagoService {

        public String createPreference(List<Map<String, Object>> productos) {
                try {
                        // Configuración de credenciales
                        MercadoPagoConfig
                                        .setAccessToken("TEST-7301278898954648-112620-4235079807c4e6dc49eb08ec008af4b7-2121369532");

                        // Crear ítems de la preferencia a partir de la lista de productos
                        List<PreferenceItemRequest> items = new ArrayList<>();
                        for (Map<String, Object> producto : productos) {
                                PreferenceItemRequest item = PreferenceItemRequest.builder()
                                                .title((String) producto.get("name"))
                                                .quantity((Integer) producto.get("quantity"))
                                                .unitPrice(new BigDecimal(
                                                                ((Number) producto.get("price")).doubleValue()))
                                                .currencyId("PEN") // Moneda: Sol peruano
                                                .build();
                                items.add(item);
                        }

                        // Crear el pagador (puedes modificar los datos según las necesidades)
                        PreferencePayerRequest payer = PreferencePayerRequest.builder()
                                        .name("Rodrigo")
                                        .surname("Vergara")
                                        .email("naircito12339@gmail.com")
                                        .build();

                        // Configurar las URLs de retorno
                        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                                        .success("https://www.success.com")
                                        .failure("http://www.failure.com")
                                        .pending("http://www.pending.com")
                                        .build();

                        // Crear la preferencia
                        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                                        .items(items)
                                        .payer(payer)
                                        .backUrls(backUrls)
                                        .autoReturn("approved")
                                        .build();

                        Preference preference = new PreferenceClient().create(preferenceRequest);

                        // Retornar la URL de inicio de pago
                        return preference.getInitPoint();
                } catch (Exception e) {
                        e.printStackTrace();
                        return "Error al generar la preferencia: " + e.getMessage();
                }
        }
}