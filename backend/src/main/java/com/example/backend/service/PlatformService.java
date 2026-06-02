package com.example.backend.service;

import com.example.backend.dto.request.PlatformRequest;
import com.example.backend.dto.response.PlatformResponse;
import com.example.backend.model.Platform;
import com.example.backend.repository.PlatformRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlatformService {

    private final PlatformRepository platformRepository;

    private PlatformResponse toResponse(Platform platform) {
        return new PlatformResponse(
                platform.getId(),
                platform.getName(),
                platform.getSlug(),
                platform.isMock(),
                platform.isActive()
        );
    }

    public List<PlatformResponse> getAll() {
        return platformRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PlatformResponse create(PlatformRequest request) {
        Platform platform = Platform.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .isMock(request.isMock())
                .active(request.isActive())
                .build();
        platformRepository.save(platform);
        return toResponse(platform);
    }

    public PlatformResponse update(UUID id, PlatformRequest request) {
        Platform platform = platformRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบ platform นี้"));

        platform.setName(request.getName());
        platform.setSlug(request.getSlug());
        platform.setMock(request.isMock());
        platform.setActive(request.isActive());
        platformRepository.save(platform);

        return toResponse(platform);
    }

    public void delete(UUID id) {
        platformRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบ platform นี้"));
        platformRepository.deleteById(id);
    }
}