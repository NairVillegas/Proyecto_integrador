package com.flamabrava.service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@CrossOrigin(origins = "https://polleriaflamabrava.netlify.app")
public class MercadoPagoService {

        public String createPreference(List<Map<String, Object>> productos) {
                try {

                        MercadoPagoConfig.setAccessToken(
                                        "TEST-7301278898954648-112620-4235079807c4e6dc49eb08ec008af4b7-2121369532");

                        List<PreferenceItemRequest> items = new ArrayList<>();
                        for (Map<String, Object> producto : productos) {
                                String name = (String) producto.get("name");
                                Integer quantity = (Integer) producto.get("quantity");
                                Object priceObj = producto.get("price");

                                BigDecimal price = BigDecimal.ZERO;
                                if (priceObj instanceof Integer) {
                                        price = new BigDecimal((Integer) priceObj);
                                } else if (priceObj instanceof Double) {
                                        price = new BigDecimal((Double) priceObj);
                                }

                                if (name == null || name.isEmpty()) {
                                        throw new IllegalArgumentException(
                                                        "El nombre del producto no puede estar vacío.");
                                }
                                if (quantity == null || quantity <= 0) {
                                        throw new IllegalArgumentException(
                                                        "La cantidad del producto debe ser mayor a 0.");
                                }
                                if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
                                        throw new IllegalArgumentException(
                                                        "El precio del producto debe ser mayor a 0.");
                                }

                                PreferenceItemRequest item = PreferenceItemRequest.builder()
                                                .title(name)
                                                .quantity(quantity)
                                                .unitPrice(price)
                                                .currencyId("PEN")
                                                .build();
                                items.add(item);
                        }

                        PreferencePayerRequest payer = PreferencePayerRequest.builder()
                                        .name("Nair")
                                        .surname("Villegas")
                                        .email("naircito12339@gmail.com")
                                        .build();

                        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                                        .success("https://www.success.com")
                                        .failure("http://www.failure.com")
                                        .pending("http://www.pending.com")
                                        .build();

                        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                                        .items(items)
                                        .payer(payer)
                                        .backUrls(backUrls)
                                        .autoReturn("approved")
                                        .build();

                        Preference preference = new PreferenceClient().create(preferenceRequest);

                        return preference.getInitPoint();

                } catch (IllegalArgumentException e) {
                        e.printStackTrace();
                        return "Error en los datos de los productos: " + e.getMessage();
                } catch (Exception e) {
                        e.printStackTrace();
                        return "Error al generar la preferencia: " + e.getMessage();
                }
        }
}