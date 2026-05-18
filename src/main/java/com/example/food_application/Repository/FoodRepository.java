package com.example.food_application.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.food_application.Entity.Food;

public interface FoodRepository extends JpaRepository<Food, Long> {
    // Name se Dakhne Ke Liye
    List<Food> findByNameContaining(String name);

    // Type se Filter Krne Ke Liye
    List<Food> findByType(String type);

}
