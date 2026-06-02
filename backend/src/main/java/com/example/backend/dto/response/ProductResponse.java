package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ProductResponse {
    private UUID id;
    private String name;
    private String description;
    private UUID categoryId;
    private LocalDateTime createdAt;

}