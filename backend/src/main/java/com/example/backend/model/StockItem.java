package com.example.backend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "stock_items")
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class StockItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "variantId")
    private ProductVariant productVariant;

    @Column(nullable = false)
    private int quantity;

    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

}
