package com.example.backend.dto.request;

import lombok.Data;

@Data
public class PlatformRequest {
    private String name;
    private String slug;
    private boolean isMock;
    private boolean active;
}
