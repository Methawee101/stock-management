package com.example.backend.dto.response;



import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class StockItemResponse {
    private UUID id;
    private UUID variantId;
    private String varintName;
    private String sku;
    private int quantity;



}
