package com.example.backend.repository;

import com.example.backend.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    List<StockMovement> findByProductVariantId(UUID variantId);
    List<StockMovement> findByOrderId (UUID orderId);
}
