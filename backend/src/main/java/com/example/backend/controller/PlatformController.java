package com.example.backend.controller;

import com.example.backend.dto.request.PlatformRequest;
import com.example.backend.dto.response.PlatformResponse;
import com.example.backend.service.PlatformService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/platforms")
@RequiredArgsConstructor
public class PlatformController {

    private final PlatformService platformService;

    @GetMapping
    public ResponseEntity<List<PlatformResponse>> getAll() {
        return ResponseEntity.ok(platformService.getAll());
    }

    @PostMapping
    public ResponseEntity<PlatformResponse> create(@RequestBody PlatformRequest request) {
        return ResponseEntity.ok(platformService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlatformResponse> update(@PathVariable UUID id,
                                                   @RequestBody PlatformRequest request) {
        return ResponseEntity.ok(platformService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        platformService.delete(id);
        return ResponseEntity.noContent().build();
    }
}