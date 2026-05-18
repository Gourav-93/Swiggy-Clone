package com.example.food_application.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.food_application.Entity.Food;
import com.example.food_application.Repository.FoodRepository;

@RestController
@CrossOrigin("*")
@RequestMapping("/api")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;

    // Bass Ek Food Ke Liye
    @PostMapping("/foods")
    public Food addFood(@RequestBody Food food) {
        return foodRepository.save(food);
    }

    // Ek Sath Sabhi Food Ke Liye
    @PostMapping("/foods/bulk")
    public List<Food> addFoods(@RequestBody List<Food> foods) {
        return foodRepository.saveAll(foods);
    }

    // Sare Food Ko Dakhne Ke Liye
    @GetMapping("/foods")
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    // ID se Dakhne Ke Liye
    @GetMapping("/foods/{id}")
    public Food getById(@PathVariable Long id) {
        return foodRepository.findById(id).orElse(null);
    }

    // Name se Dakhne Ke Liye
    @GetMapping("/foods/search/{name}")
    public List<Food> search(@PathVariable String name) {
        return foodRepository.findByNameContaining(name);
    }

    // Filter Krne Ke Liye Type Se
    @GetMapping("/foods/type/{type}")
    public List<Food> filterByType(@PathVariable String type) {
        return foodRepository.findByType(type);
    }

    // Food Update Krne Ke Liye
    @PutMapping("/foods/{id}")
    public Food update(@PathVariable Long id, @RequestBody Food food) {
        Food existing = foodRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setName(food.getName());
            existing.setDescription(food.getDescription());
            existing.setPrice(food.getPrice());
            existing.setImage(food.getImage());
            existing.setType(food.getType());
            existing.setRestaurant(food.getRestaurant());

            return foodRepository.save(existing);
        }
        return null;
    }

    // Food Delete Krne Ke Liye
    @DeleteMapping("/foods/{id}")
    public String delete(@PathVariable Long id) {
        foodRepository.deleteById(id);
        return "Deleted successfully";
    }
}