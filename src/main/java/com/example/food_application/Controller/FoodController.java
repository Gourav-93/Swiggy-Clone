package com.example.food_application.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.food_application.Entity.Food;
import com.example.food_application.Repository.FoodRepository;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;

    @PostMapping
    public ResponseEntity<Food> addFood(@RequestBody Food food) {
        return ResponseEntity.status(HttpStatus.CREATED).body(foodRepository.save(food));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Food>> addFoods(@RequestBody List<Food> foods) {
        return ResponseEntity.status(HttpStatus.CREATED).body(foodRepository.saveAll(foods));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Food> getById(@PathVariable Long id) {
        return foodRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/{name}")
    public List<Food> search(@PathVariable String name) {
        return foodRepository.findByNameContaining(name);
    }

    @GetMapping("/type/{type}")
    public List<Food> filterByType(@PathVariable String type) {
        return foodRepository.findByType(type);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(foodRepository.findDistinctType());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Food> update(@PathVariable Long id, @RequestBody Food food) {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        if (foodRepository.existsById(id)) {
            foodRepository.deleteById(id);
            return ResponseEntity.ok("Deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Food not found");
    }
}