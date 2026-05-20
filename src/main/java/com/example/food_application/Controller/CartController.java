package com.example.food_application.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.food_application.Entity.CartItem;
import com.example.food_application.Repository.CartRepository;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem cart) {
        return cartRepository.findByUserIdAndFoodId(cart.getUserId(), cart.getFoodId())
            .map(existing -> {
                existing.setQuantity(existing.getQuantity() + cart.getQuantity());
                return ResponseEntity.ok(cartRepository.save(existing));
            })
            .orElseGet(() -> ResponseEntity.ok(cartRepository.save(cart)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartRepository.findByUserId(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> remove(@PathVariable Long id) {
        if (cartRepository.existsById(id)) {
            cartRepository.deleteById(id);
            return ResponseEntity.ok("Removed from cart");
        }
        return ResponseEntity.notFound().build();
    }
}
