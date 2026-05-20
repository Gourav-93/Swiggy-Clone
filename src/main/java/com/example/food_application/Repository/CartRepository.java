package com.example.food_application.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.food_application.Entity.CartItem;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    java.util.Optional<CartItem> findByUserIdAndFoodId(Long userId, Long foodId);
    
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    void deleteByUserId(Long userId);
}
