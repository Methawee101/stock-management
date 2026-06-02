package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class PlatformListingResponse {
    private UUID id;
    private UUID variantId;
    private String variantName;
    private String sku;
    private UUID platformId;
    private String platformName;
    private String platformSku;
    private boolean isActive;
}
