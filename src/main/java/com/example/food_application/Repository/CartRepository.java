package com.example.food_application.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.food_application.Entity.CartItem;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
}
