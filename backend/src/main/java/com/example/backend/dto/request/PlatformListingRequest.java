package com.example.backend.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class PlatformListingRequest {
    private UUID platformId;

    private UUID variantId;

    private String platformSku;

    private boolean active;
}
