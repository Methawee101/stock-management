package com.example.backend.controller;

import com.example.backend.dto.request.ProductVariantRequest;
import com.example.backend.dto.response.ProductVariantResponse;
import com.example.backend.service.ProductVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/variants")
@RequiredArgsConstructor
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductVariantResponse>> getByProduct(@PathVariable UUID productId) {
        return ResponseEntity.ok(productVariantService.getByProduct(productId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductVariantResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(productVariantService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProductVariantResponse>> getAll() {
        return ResponseEntity.ok(productVariantService.getAll());
    }

    @PostMapping
    public ResponseEntity<ProductVariantResponse> create(@Valid @RequestBody ProductVariantRequest request) {
        return ResponseEntity.ok(productVariantService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductVariantResponse> update(@PathVariable UUID id,
                                                         @Valid @RequestBody ProductVariantRequest request) {
        return ResponseEntity.ok(productVariantService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        productVariantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
