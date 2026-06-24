package com.example.food_application.Service;

import com.example.food_application.DTO.AuthRequest;
import com.example.food_application.DTO.AuthResponse;
import com.example.food_application.DTO.UserDto;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    UserDto register(AuthRequest request);
}
