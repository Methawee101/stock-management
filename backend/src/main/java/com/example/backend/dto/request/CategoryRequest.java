package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "name category is require")
    private  String name;

    @NotBlank(message = "slug is require")
    private String slug;
}
