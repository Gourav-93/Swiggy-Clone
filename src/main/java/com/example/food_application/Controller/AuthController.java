package com.example.food_application.Controller;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.food_application.Entity.User;
import com.example.food_application.Repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        user.setRole("USER");
        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(user));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());

        if (existing.isPresent()) {
            User found = existing.get();
            if (found.getPassword().equals(user.getPassword())) {
                // Validate Role
                if (user.getRole() != null && !found.getRole().equalsIgnoreCase(user.getRole())) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Incorrect role selected for this account");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }
                return ResponseEntity.ok(found);
            }
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Invalid email or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
