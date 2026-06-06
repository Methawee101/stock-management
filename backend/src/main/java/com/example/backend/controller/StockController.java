package com.example.backend.controller;

import com.example.backend.dto.request.StockAdjustRequest;
import com.example.backend.dto.request.StockInRequest;
import com.example.backend.dto.response.ProductResponse;
import com.example.backend.dto.response.StockItemResponse;
import com.example.backend.dto.response.StockMovementResponse;
import com.example.backend.model.StockItem;
import com.example.backend.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;


    @GetMapping
    public ResponseEntity<List<StockItemResponse>> getAll() {
        return ResponseEntity.ok(stockService.getAll());
    }

    @GetMapping("/{variantId}")
    public ResponseEntity<StockItemResponse> getByVariantId(@PathVariable UUID variantId) {
        return ResponseEntity.ok((stockService.getByVariantId(variantId)));
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<StockItemResponse> getById(@PathVariable UUID id) {
//        return ResponseEntity.ok(stockService.getById(id));
//    }

    @PostMapping("/in")
    public ResponseEntity<StockItemResponse> stockIn(@Valid @RequestBody StockInRequest request) {
        return ResponseEntity.ok(stockService.stockIn(request));
    }

    @PostMapping("/adjust")
    public ResponseEntity<StockItemResponse> adjust(@Valid @RequestBody StockAdjustRequest request) {
        return ResponseEntity.ok(stockService.adjust(request));
    }

    @GetMapping("/movements")
    public  ResponseEntity<List<StockMovementResponse>> getAllMovements(){
        return ResponseEntity.ok(
                stockService.getAllMovements()
        );
    }

    @GetMapping("/movements/{variantId}")
    public ResponseEntity<List<StockMovementResponse>> getMovementsByVariant(@PathVariable UUID variantId){
        return ResponseEntity.ok(stockService.getMovementsByVariant(variantId));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<StockItemResponse>> getLowStock() {
        return ResponseEntity.ok(stockService.getLowStock());
    }






}
