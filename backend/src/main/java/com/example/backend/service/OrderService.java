package com.example.backend.service;

import com.example.backend.dto.request.OrderStatusRequest;
import com.example.backend.dto.request.WebhookRequest;
import com.example.backend.dto.response.OrderResponse;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PlatformRepository platformRepository;
    private final PlatformListingRepository platformListingRepository;
    private final StockItemRepository stockItemRepository;
    private final StockMovementRepository stockMovementRepository;

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getOrderItems()
                .stream()
                .map(item -> new OrderResponse.OrderItemResponse(
                        item.getId(),
                        item.getProductVariant().getName(),
                        item.getProductVariant().getSku(),
                        item.getQuantity(),
                        item.getUnitPrice()
                ))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getPlatform().getName(),
                order.getPlatformOrderId(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getCustomerName(),
                order.getCustomerAddress(),
                order.getOrderedAt(),
                items
        );
    }

    // ดึงออเดอร์ทั้งหมด
    public List<OrderResponse> getAll() {
        return orderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ดึงออเดอร์ตาม id
    public OrderResponse getById(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบออเดอร์นี้"));
        return toResponse(order);
    }

    // รับ webhook จาก platform
    @Transactional
    public OrderResponse receiveWebhook(String platformSlug, WebhookRequest request) {
        // 1. หา platform จาก slug
        Platform platform = platformRepository.findBySlug(platformSlug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบ platform นี้"));

        // 2. สร้าง Order
        Order order = Order.builder()
                .platform(platform)
                .platformOrderId(request.getPlatformOrderId())
                .status(Order.Status.PENDING)
                .customerName(request.getCustomerName())
                .customerAddress(request.getCustomerAddress())
                .totalAmount(BigDecimal.ZERO)
                .build();
        orderRepository.save(order);

        // 3. วนลูป items
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (WebhookRequest.WebhookItemRequest item : request.getItems()) {
            // หา PlatformListing จาก platformSku
            PlatformListings listing = platformListingRepository
                    .findByPlatformIdAndPlatformSku(platform.getId(), item.getPlatformSku())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "ไม่พบสินค้า: " + item.getPlatformSku()));

            ProductVariant variant = listing.getProductVariant();

            // เช็คสต็อก
            StockItem stockItem = stockItemRepository
                    .findByProductVariantId(variant.getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "ไม่มีสต็อกสินค้า: " + variant.getSku()));

            if (stockItem.getQuantity() < item.getQuantity()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "สต็อกไม่พอ: " + variant.getSku());
            }

            // ตัดสต็อก
            stockItem.setQuantity(stockItem.getQuantity() - item.getQuantity());
            stockItemRepository.save(stockItem);

            // บันทึก StockMovement
            StockMovement movement = StockMovement.builder()
                    .productVariant(variant)
                    .order(order)
                    .type(StockMovement.MovementType.OUT)
                    .quantityChange(-item.getQuantity())
                    .note("ออเดอร์จาก " + platform.getName())
                    .build();
            stockMovementRepository.save(movement);

            // สร้าง OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productVariant(variant)
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .build();
            orderItemRepository.save(orderItem);

            // รวมยอด
            totalAmount = totalAmount.add(
                    item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
            );
        }

        // 4. อัปเดต totalAmount
        order.setTotalAmount(totalAmount);
        orderRepository.save(order);

        return toResponse(order);
    }

    // อัปเดตสถานะ
    public OrderResponse updateStatus(UUID id, OrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบออเดอร์นี้"));

        order.setStatus(Order.Status.valueOf(request.getStatus()));
        orderRepository.save(order);

        return toResponse(order);
    }
}