package com.example.backend.repository;

import com.example.backend.model.PlatformListings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlatformListingRepository extends JpaRepository<PlatformListings, UUID> {
    List<PlatformListings> findByProductVariantId(UUID variantId);
    List<PlatformListings> findByPlatformId(UUID platformId);
    Optional<PlatformListings> findByPlatformIdAndPlatformSku(UUID platformId, String platformSku);

}
