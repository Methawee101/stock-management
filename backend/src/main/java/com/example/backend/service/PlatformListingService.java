package com.example.backend.service;

import com.example.backend.dto.request.PlatformListingRequest;
import com.example.backend.dto.response.PlatformListingResponse;
import com.example.backend.model.Platform;
import com.example.backend.model.PlatformListings;
import com.example.backend.model.ProductVariant;
import com.example.backend.repository.PlatformListingRepository;
import com.example.backend.repository.PlatformRepository;
import com.example.backend.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlatformListingService {
    private final PlatformListingRepository platformListingRepository;
    private final PlatformRepository platformRepository;
    private final ProductVariantRepository productVariantRepository;

    private PlatformListingResponse toResponse(PlatformListings listings) {
        return new PlatformListingResponse(
                listings.getId(),
                listings.getProductVariant().getId(),
                listings.getProductVariant().getName(),
                listings.getProductVariant().getSku(),
                listings.getPlatform().getId(),
                listings.getPlatform().getName(),
                listings.getPlatformSku(),
                listings.isActive()
        );
    }

    public List<PlatformListingResponse> getAll() {
        return platformListingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PlatformListingResponse create(PlatformListingRequest request) {
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"Not found this variant"
                ));
        Platform platform = platformRepository.findById(request.getPlatformId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"Not found this variant"
                ));

        PlatformListings listing = PlatformListings.builder()
                .productVariant(variant)
                .platform(platform)
                .platformSku(request.getPlatformSku())
                .active(request.isActive())
                .build();

        platformListingRepository.save(listing);
        return toResponse(listing);
    }

    public  void delete(UUID id) {
        platformListingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Not found this listing"
                ));
        platformListingRepository.deleteById(id);
    }

}
