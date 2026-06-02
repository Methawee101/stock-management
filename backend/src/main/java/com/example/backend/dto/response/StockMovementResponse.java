package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class StockMovementResponse {
    private UUID id;
    private UUID variantId;
    private String variantName;
    private String type; //IN,OUT,ADJUST
    private  int quantityChange;
    private String note;
    private LocalDateTime creatAt;
}
