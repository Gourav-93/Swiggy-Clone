package com.example.food_application.Controller;

import com.example.food_application.DTO.ReviewDto;
import com.example.food_application.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewDto> addReview(@RequestBody ReviewDto dto, Authentication auth) {
        return ResponseEntity.ok(reviewService.addReview(auth.getName(), dto));
    }
}
