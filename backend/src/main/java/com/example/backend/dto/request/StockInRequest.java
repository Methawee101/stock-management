package com.example.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class StockInRequest {
    @NotNull(message = "quantity is require")
    private int quantity;

    @NotNull(message = "variantId is require")
    private UUID variantId;

    private  String note;

}
