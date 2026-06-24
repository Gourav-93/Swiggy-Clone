package com.example.food_application.Repository;

import com.example.food_application.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByFoodId(Long foodId);
    List<Review> findByUserId(Long userId);
    boolean existsByUserIdAndOrderIdAndFoodId(Long userId, Long orderId, Long foodId);
}
