package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductVariantRequest {

    private int lowStockAlert;

    @NotBlank(message = "name is require")
    private  String name;

    @NotNull(message = "price is require")
    private BigDecimal price;

    @NotBlank(message = "sku is require")
    private  String sku;

    @NotNull(message = "select product")
    private UUID productId;
}
