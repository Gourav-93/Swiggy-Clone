package com.example.food_application.Service;

import com.example.food_application.DTO.ProfileUpdateDto;
import com.example.food_application.DTO.UserDto;
import com.example.food_application.Entity.User;
import com.example.food_application.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    public UserDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getPhoneNumber(), user.getProfilePicture());
    }

    public UserDto updateProfile(String email, ProfileUpdateDto dto) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getProfilePicture() != null) user.setProfilePicture(dto.getProfilePicture());
        
        userRepository.save(user);
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getPhoneNumber(), user.getProfilePicture());
    }
}
