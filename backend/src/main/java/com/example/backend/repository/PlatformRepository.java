package com.example.backend.repository;

import com.example.backend.model.Platform;
import com.example.backend.model.PlatformListings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlatformRepository extends JpaRepository<Platform, UUID> {
    Optional<Platform> findBySlug(String slug);
}
