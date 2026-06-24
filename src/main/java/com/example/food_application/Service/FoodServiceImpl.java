package com.example.food_application.Service;

import com.example.food_application.Entity.Food;
import com.example.food_application.Repository.FoodRepository;
import com.example.food_application.Exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Override
    public Food addFood(Food food) {
        return foodRepository.save(food);
    }

    @Override
    public List<Food> addFoods(List<Food> foods) {
        return foodRepository.saveAll(foods);
    }

    @Override
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    @Override
    public Food getFoodById(Long id) {
        return foodRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Food not found with id " + id));
    }

    @Override
    public List<Food> search(String name) {
        return foodRepository.findByNameContaining(name);
    }

    @Override
    public List<Food> filterByType(String type) {
        return foodRepository.findByType(type);
    }

    @Override
    public List<String> getCategories() {
        return foodRepository.findDistinctType();
    }

    @Override
    public Food updateFood(Long id, Food food) {
        Food existing = getFoodById(id);
        existing.setName(food.getName());
        existing.setDescription(food.getDescription());
        existing.setPrice(food.getPrice());
        existing.setImage(food.getImage());
        existing.setType(food.getType());
        existing.setRestaurant(food.getRestaurant());
        return foodRepository.save(existing);
    }

    @Override
    public void deleteFood(Long id) {
        Food existing = getFoodById(id);
        foodRepository.delete(existing);
    }
}
