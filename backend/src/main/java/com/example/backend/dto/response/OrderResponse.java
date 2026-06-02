package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class OrderResponse {
    private UUID id;
    private String platformName;
    private String platformOrderId;
    private String status;
    private BigDecimal totalAmount;
    private String customerName;
    private String customerAddress;
    private LocalDateTime orderedAt;
    private List<OrderItemResponse> items;

    @Data
    @AllArgsConstructor
    public static class OrderItemResponse {
        private UUID id;
        private String variantName;
        private String sku;
        private int quantity;
        private BigDecimal unitPrice;
    }
}