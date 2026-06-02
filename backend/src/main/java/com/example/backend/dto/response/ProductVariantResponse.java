package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ProductVariantResponse {

    private UUID id;
    private UUID productId;
    private  String productName;
    private String sku;
    private String name;
    private BigDecimal price;
    private int low_stock_alert;
}
