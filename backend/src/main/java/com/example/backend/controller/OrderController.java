package com.example.backend.controller;

import com.example.backend.dto.request.OrderStatusRequest;
import com.example.backend.dto.request.WebhookRequest;
import com.example.backend.dto.response.OrderResponse;
import com.example.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @PostMapping("/webhook/{platformSlug}")
    public ResponseEntity<OrderResponse> receiveWebhook(
            @PathVariable String platformSlug,
            @RequestBody WebhookRequest request) {
        return ResponseEntity.ok(orderService.receiveWebhook(platformSlug, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable UUID id,
            @RequestBody OrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<OrderResponse>> filter(
            @RequestParam(required = false) UUID platformId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(orderService.filter(platformId, status));
    }
}