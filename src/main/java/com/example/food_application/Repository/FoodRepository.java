package com.example.food_application.Repository;

import com.example.food_application.Entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long>, JpaSpecificationExecutor<Food> {

    List<Food> findTop10ByOrderByRatingDesc();

    List<Food> findTop10ByOrderByNumReviewsDesc();

    List<Food> findByNameContaining(String name);

    List<Food> findByType(String type);

    @Query("SELECT DISTINCT f.type FROM Food f WHERE f.type IS NOT NULL")
    List<String> findDistinctType();
}
