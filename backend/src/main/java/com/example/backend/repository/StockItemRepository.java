package com.example.backend.repository;

import com.example.backend.model.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StockItemRepository extends JpaRepository<StockItem, UUID> {
    Optional<StockItem> findByProductVariantId(UUID variantId);
}
