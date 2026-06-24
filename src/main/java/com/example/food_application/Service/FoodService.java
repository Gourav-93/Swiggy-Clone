package com.example.food_application.Service;

import com.example.food_application.Entity.Food;
import java.util.List;

public interface FoodService {
    Food addFood(Food food);
    List<Food> addFoods(List<Food> foods);
    List<Food> getAllFoods();
    Food getFoodById(Long id);
    List<Food> search(String name);
    List<Food> filterByType(String type);
    List<String> getCategories();
    Food updateFood(Long id, Food food);
    void deleteFood(Long id);
}
