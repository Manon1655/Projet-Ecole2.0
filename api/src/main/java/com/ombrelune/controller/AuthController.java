package com.ombrelune.controller;

import com.ombrelune.dto.*;
import com.ombrelune.entity.User;
import com.ombrelune.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .build();

            User savedUser = userService.registerUser(user);

            AuthResponse response = AuthResponse.builder()
                    .userId(savedUser.getId())
                    .username(savedUser.getUsername())
                    .email(savedUser.getEmail())
                    .message("User registered successfully")
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new HashMap<String, String>() {{
                        put("error", e.getMessage());
                    }});
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userService.findByUsername(request.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (userService.validatePassword(request.getPassword(), user.getPassword())) {
                AuthResponse response = AuthResponse.builder()
                        .userId(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .message("Login successful")
                        .build();
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new HashMap<String, String>() {{
                    put("error", "Invalid username or password");
                }});
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        Optional<User> userOpt = userService.findById(id);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserProfileDTO profile = UserProfileDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .profilePicture(user.getProfilePicture())
                    .bio(user.getBio())
                    .phoneNumber(user.getPhoneNumber())
                    .subscriptionId(user.getSubscription() != null ? user.getSubscription().getId() : null)
                    .subscriptionName(user.getSubscription() != null ? user.getSubscription().getName() : null)
                    .createdAt(user.getCreatedAt().toString())
                    .build();
            return ResponseEntity.ok(profile);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new HashMap<String, String>() {{
                    put("error", "User not found");
                }});
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody UserProfileDTO profileDTO) {
        Optional<User> userOpt = userService.findById(id);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setFirstName(profileDTO.getFirstName());
            user.setLastName(profileDTO.getLastName());
            user.setProfilePicture(profileDTO.getProfilePicture());
            user.setBio(profileDTO.getBio());
            user.setPhoneNumber(profileDTO.getPhoneNumber());

            User updatedUser = userService.updateUser(user);

            UserProfileDTO response = UserProfileDTO.builder()
                    .id(updatedUser.getId())
                    .username(updatedUser.getUsername())
                    .email(updatedUser.getEmail())
                    .firstName(updatedUser.getFirstName())
                    .lastName(updatedUser.getLastName())
                    .profilePicture(updatedUser.getProfilePicture())
                    .bio(updatedUser.getBio())
                    .phoneNumber(updatedUser.getPhoneNumber())
                    .subscriptionId(updatedUser.getSubscription() != null ? updatedUser.getSubscription().getId() : null)
                    .subscriptionName(updatedUser.getSubscription() != null ? updatedUser.getSubscription().getName() : null)
                    .createdAt(updatedUser.getCreatedAt().toString())
                    .build();

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new HashMap<String, String>() {{
                    put("error", "User not found");
                }});
    }
}
