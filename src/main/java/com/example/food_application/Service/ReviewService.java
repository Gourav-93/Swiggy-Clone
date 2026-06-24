package com.example.food_application.Service;

import com.example.food_application.DTO.ReviewDto;
import com.example.food_application.Entity.Food;
import com.example.food_application.Entity.Order;
import com.example.food_application.Entity.Review;
import com.example.food_application.Entity.User;
import com.example.food_application.Repository.FoodRepository;
import com.example.food_application.Repository.OrderRepository;
import com.example.food_application.Repository.ReviewRepository;
import com.example.food_application.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FoodRepository foodRepository;
    @Autowired
    private OrderRepository orderRepository;

    public ReviewDto addReview(String email, ReviewDto dto) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Food food = foodRepository.findById(dto.getFoodId()).orElseThrow(() -> new RuntimeException("Food not found"));
        Order order = orderRepository.findById(dto.getOrderId()).orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getStatus().equals("DELIVERED")) {
            throw new RuntimeException("Can only review delivered orders");
        }

        if (reviewRepository.existsByUserIdAndOrderIdAndFoodId(user.getId(), order.getId(), food.getId())) {
            throw new RuntimeException("Review already exists for this order item");
        }

        Review review = new Review(user, food, order, dto.getRating(), dto.getComment());
        reviewRepository.save(review);
        
        // Update food average rating
        List<Review> allReviews = reviewRepository.findByFoodId(food.getId());
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        food.setRating(avg);
        food.setNumReviews(allReviews.size());
        foodRepository.save(food);

        dto.setId(review.getId());
        dto.setUserName(user.getName());
        return dto;
    }
}
