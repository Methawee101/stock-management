package com.example.backend.service;

import com.example.backend.dto.request.CategoryRequest;
import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.model.Category;
import com.example.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

//    ดึงทั้งหมด
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(c -> new CategoryResponse(c.getId(),c.getName(),c.getSlug()))
                .collect(Collectors.toList());
    }
//    สร้างใหม่
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.findBySlug(request.getSlug()).isPresent()) {
            throw  new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug is already");
        }

        Category category = Category.builder()
                .name(request.getName())
                .slug(request.getSlug())
//                url
                .build();

        categoryRepository.save(category);
        return new CategoryResponse(category.getId(), category.getName(), category.getSlug());
    }




//แก้ไข
    public CategoryResponse update(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("category not found"));

        category.setName(request.getName());
        category.setSlug(request.getSlug());
        categoryRepository.save(category);

        return new CategoryResponse(category.getId(), category.getName(), category.getSlug());
    }

//    ลบ
    public  void delete(UUID id) {
        categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("category not found"));
        categoryRepository.deleteById(id);
    }




}
