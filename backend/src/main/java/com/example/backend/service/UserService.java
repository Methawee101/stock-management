package com.example.backend.service;

import com.example.backend.dto.request.UpdateUserRequest;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }

    // ดึง user ทั้งหมด
    public List<UserResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ดึง user ตาม id
    public UserResponse getById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบ user นี้"));
        return toResponse(user);
    }

    // แก้ไข user
    public UserResponse update(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบ user นี้"));

        user.setName(request.getName());

        if (request.getRole() != null) {
            user.setRole(User.Role.valueOf(request.getRole()));
        }

        userRepository.save(user);
        return toResponse(user);
    }

    // ลบ user
    public void delete(UUID id) {
        userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบ user นี้"));
        userRepository.deleteById(id);
    }
}