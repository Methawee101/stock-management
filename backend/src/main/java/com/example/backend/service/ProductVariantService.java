package com.example.backend.service;

import com.example.backend.dto.request.ProductVariantRequest;
import com.example.backend.dto.response.ProductVariantResponse;
import com.example.backend.model.Product;
import com.example.backend.model.ProductVariant;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private  final ProductRepository productRepository;

    private ProductVariantResponse toResponse(ProductVariant variant) {
        return new ProductVariantResponse(
                variant.getId(),
                variant.getProduct().getId(),
                variant.getProduct().getName(),
                variant.getSku(),
                variant.getName(),
                variant.getPrice(),
                variant.getLowStockAlert()
        );
    }

    public List<ProductVariantResponse> getAll() {
        return productVariantRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductVariantResponse> getByProduct(UUID productId) {
        return productVariantRepository.findByProductId(productId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductVariantResponse getById(UUID id) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Not found this variant"));
            return  toResponse(variant);
    }

    public ProductVariantResponse create(ProductVariantRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบสินค้านี้"));

        if (productVariantRepository.findBySku(request.getSku()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "SKU นี้ถูกใช้งานแล้ว");
        }

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .sku(request.getSku())
                .name(request.getName())
                .price(request.getPrice())
                .lowStockAlert(request.getLowStockAlert())
                .build();

        productVariantRepository.save(variant);
        return toResponse(variant);
    }

    public  ProductVariantResponse update(UUID id, ProductVariantRequest request) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"not found this variant"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"not found this product"));

        variant.setProduct(product);
        variant.setSku(request.getSku());
        variant.setName(request.getName());
        variant.setPrice(request.getPrice());
        variant.setLowStockAlert(request.getLowStockAlert());
        productVariantRepository.save(variant);

        return toResponse(variant);
    }

    public  void delete(UUID id) {
        productVariantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"not found this variant"));
        productVariantRepository.deleteById(id);
    }


}
