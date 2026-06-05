package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class UpdateUserRequest {

    @NotBlank
    private String name;
    private String role;

}
