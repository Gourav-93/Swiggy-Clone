package com.example.food_application.Controller;

import com.example.food_application.DTO.ProfileUpdateDto;
import com.example.food_application.DTO.UserDto;
import com.example.food_application.Service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<UserDto> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.getUserProfile(email));
    }

    @PutMapping
    public ResponseEntity<UserDto> updateProfile(@RequestBody ProfileUpdateDto dto, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.updateProfile(email, dto));
    }
}
