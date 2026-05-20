package com.example.food_application.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.example.food_application.Entity.Food;
import com.example.food_application.Repository.FoodRepository;

@RestController
@RequestMapping("/api/admin/food")
@CrossOrigin(origins = "*")
public class AdminFoodController {

    @Autowired
    private FoodRepository foodRepository;

    private void validateAdminRole(String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new RuntimeException("ACCESS_DENIED: Admin privileges required for this operation.");
        }
    }

    @GetMapping("/all")
    public List<Food> getAllFoods(@RequestHeader(value = "X-User-Role", required = false) String role) {
        validateAdminRole(role);
        return foodRepository.findAll();
    }

    @PostMapping("/add")
    public Food addFood(@RequestBody Food food, @RequestHeader(value = "X-User-Role", required = false) String role) {
        validateAdminRole(role);
        return foodRepository.save(food);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Food> updateFood(@PathVariable Long id, @RequestBody Food food, @RequestHeader(value = "X-User-Role", required = false) String role) {
        validateAdminRole(role);
        return foodRepository.findById(id).map(existing -> {
            existing.setName(food.getName());
            existing.setDescription(food.getDescription());
            existing.setPrice(food.getPrice());
            existing.setImage(food.getImage());
            existing.setType(food.getType());
            existing.setRestaurant(food.getRestaurant());
            return ResponseEntity.ok(foodRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFood(@PathVariable Long id, @RequestHeader(value = "X-User-Role", required = false) String role) {
        validateAdminRole(role);
        if (foodRepository.existsById(id)) {
            foodRepository.deleteById(id);
            return ResponseEntity.ok("Deleted Successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
