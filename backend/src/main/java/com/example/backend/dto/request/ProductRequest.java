package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ProductRequest {

    @NotBlank(message = "name is require")
    private String name;

    private String description;

    @NotNull(message = "category is require")
    private UUID categoryId;
}
