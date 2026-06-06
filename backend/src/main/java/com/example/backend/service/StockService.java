package com.example.backend.service;

import com.example.backend.dto.request.ProductRequest;
import com.example.backend.dto.request.StockAdjustRequest;
import com.example.backend.dto.request.StockInRequest;
import com.example.backend.dto.response.ProductResponse;
import com.example.backend.dto.response.ProductVariantResponse;
import com.example.backend.dto.response.StockItemResponse;
import com.example.backend.dto.response.StockMovementResponse;
import com.example.backend.model.*;
import com.example.backend.repository.ProductVariantRepository;
import com.example.backend.repository.StockItemRepository;
import com.example.backend.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockService {

    private final ProductVariantRepository productVariantRepository;
    private final StockItemRepository stockItemRepository;
    private final StockMovementRepository stockMovementRepository;

    private StockItemResponse toResponse(StockItem stockItem) {
        return new StockItemResponse(
                stockItem.getId(),
                stockItem.getProductVariant().getId(),
                stockItem.getProductVariant().getName(),
                stockItem.getProductVariant().getSku(),
                stockItem.getQuantity()
        );
    }

    public List<StockItemResponse> getAll() {
        return stockItemRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StockItemResponse getByVariantId(UUID variantId) {
        StockItem stockItem = stockItemRepository.findByProductVariantId(variantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"no found stock this variant"));
        return  toResponse(stockItem);
    }

    public StockItemResponse getById(UUID id) {
        StockItem stockItem = stockItemRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"not found this stockItem"));
        return toResponse(stockItem);
    }

    //รับสินค้าเข้าคลัง
    public StockItemResponse stockIn(StockInRequest request) {
        // 1. หา variant
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบ variant นี้"));

        // 2. หา StockItem ถ้าไม่มีให้สร้างใหม่
        StockItem stockItem = stockItemRepository.findByProductVariantId(request.getVariantId())
                .orElse(StockItem.builder()
                        .productVariant(variant)
                        .quantity(0)
                        .build());

        // 3. เพิ่ม quantity
        stockItem.setQuantity(stockItem.getQuantity() + request.getQuantity());
        stockItemRepository.save(stockItem);

        // 4. บันทึก history
        StockMovement movement = StockMovement.builder()
                .productVariant(variant)
                .type(StockMovement.MovementType.IN)
                .quantityChange(request.getQuantity())
                .note(request.getNote())
                .build();
        stockMovementRepository.save(movement);

        return toResponse(stockItem);
    }


    // ประบ Stock manual
    public StockItemResponse adjust(StockAdjustRequest request) {
        // 1. หา variant
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบ variant นี้"));

        // 2. หา StockItem ถ้าไม่มีให้สร้างใหม่
        StockItem stockItem = stockItemRepository.findByProductVariantId(request.getVariantId())
                .orElse(StockItem.builder()
                        .productVariant(variant)
                        .quantity(0)
                        .build());

        // 3. คำนวณ quantityChange สำหรับ history
        int quantityChange = request.getQuantity() - stockItem.getQuantity();

        // 4. ตั้งค่า quantity ใหม่
        stockItem.setQuantity(request.getQuantity());
        stockItemRepository.save(stockItem);

        // 5. บันทึก history
        StockMovement movement = StockMovement.builder()
                .productVariant(variant)
                .type(StockMovement.MovementType.ADJUST)
                .quantityChange(quantityChange) // + หรือ - ขึ้นอยู่กับว่าเพิ่มหรือลด
                .note(request.getNote())
                .build();
        stockMovementRepository.save(movement);

        return toResponse(stockItem);
    }

    // ดู history ทั้งหมด
    public List<StockMovementResponse> getAllMovements() {
        return stockMovementRepository.findAll()
                .stream()
                .map(m -> new StockMovementResponse(
                        m.getId(),
                        m.getProductVariant().getId(),
                        m.getProductVariant().getName(),
                        m.getType().name(),
                        m.getQuantityChange(),
                        m.getNote(),
                        m.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    // ดู history ตาม variantId
    public List<StockMovementResponse> getMovementsByVariant(UUID variantId) {
        return stockMovementRepository.findByProductVariantId(variantId)
                .stream()
                .map(m -> new StockMovementResponse(
                        m.getId(),
                        m.getProductVariant().getId(),
                        m.getProductVariant().getName(),
                        m.getType().name(),
                        m.getQuantityChange(),
                        m.getNote(),
                        m.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    public List<StockItemResponse> getLowStock() {
        return stockItemRepository.findAll()
                .stream()
                .filter(s -> s.getQuantity() <= s.getProductVariant().getLowStockAlert())
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    


}
