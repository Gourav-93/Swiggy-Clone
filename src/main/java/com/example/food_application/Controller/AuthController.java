package com.example.food_application.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.food_application.Entity.User;
import com.example.food_application.Repository.UserRepository;

@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setRole("USER");
        return userRepository.save(user);
    }

    // LOGIN (Ye Simple Login Hai, JWT Nahi Hai Abhi)
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        Optional<User> existing = userRepository.findByEmail(user.getEmail());

        if (existing.isPresent()) {
            if (existing.get().getPassword().equals(user.getPassword())) {
                return "LOGIN SUCCESS (JWT will come next step)";
            }
        }

        return "INVALID CREDENTIALS";
    }
}
