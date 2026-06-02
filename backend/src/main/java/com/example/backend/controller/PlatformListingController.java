package com.example.backend.controller;

import com.example.backend.dto.request.PlatformListingRequest;
import com.example.backend.dto.response.PlatformListingResponse;
import com.example.backend.service.PlatformListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class PlatformListingController {

    private final PlatformListingService platformListingService;

    @GetMapping
    public ResponseEntity<List<PlatformListingResponse>> getAll() {
        return ResponseEntity.ok(platformListingService.getAll());
    }

    @PostMapping
    public ResponseEntity<PlatformListingResponse> create(@RequestBody PlatformListingRequest request) {
        return ResponseEntity.ok(platformListingService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        platformListingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}