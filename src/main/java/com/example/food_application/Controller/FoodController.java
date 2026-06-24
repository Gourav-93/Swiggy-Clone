package com.example.food_application.Controller;

import com.example.food_application.Entity.Food;
import com.example.food_application.Service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private com.example.food_application.Repository.FoodRepository foodRepository;



    @GetMapping
    public ResponseEntity<List<Food>> getAllFoods() {
        return ResponseEntity.ok(foodService.getAllFoods());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Food> getById(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getFoodById(id));
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<List<Food>> search(@PathVariable String name) {
        return ResponseEntity.ok(foodService.search(name));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Food>> filterByType(@PathVariable String type) {
        return ResponseEntity.ok(foodService.filterByType(type));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(foodService.getCategories());
    }



    @Autowired
    private com.example.food_application.Service.FoodFilterService foodFilterService;

    @PostMapping("/filter")
    public ResponseEntity<List<Food>> filterFoods(@RequestBody com.example.food_application.DTO.FoodFilterDto filter) {
        return ResponseEntity.ok(foodFilterService.getFilteredFoods(filter)); 
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<Food>> getRecommended() {
        return ResponseEntity.ok(foodRepository.findTop10ByOrderByRatingDesc()); 
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<Food>> getPopular() {
        return ResponseEntity.ok(foodRepository.findTop10ByOrderByNumReviewsDesc()); 
    }
    

}