package com.example.backend.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class WebhookRequest {
    private String platformOrderId;
    private String customerName;
    private String customerAddress;
    private List<WebhookItemRequest> items;

    @Data
    public static class WebhookItemRequest {
        private String platformSku;
        private int quantity;
        private BigDecimal unitPrice;
    }
}