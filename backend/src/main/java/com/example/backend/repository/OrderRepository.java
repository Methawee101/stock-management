package com.example.backend.repository;

import com.example.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByPlatformId(UUID platformId);
    List<Order> findByStatus(Order.Status status);
    List<Order> findByPlatformIdAndStatus(UUID platformId, Order.Status status);
    List<Order> findByOrderedAtBetween(LocalDateTime start, LocalDateTime end);
}
