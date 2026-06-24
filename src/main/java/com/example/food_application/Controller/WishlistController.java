package com.example.food_application.Controller;

import com.example.food_application.Entity.Wishlist;
import com.example.food_application.Service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Wishlist>> getUserWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(userId));
    }

    @PostMapping("/user/{userId}/food/{foodId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long userId, @PathVariable Long foodId) {
        wishlistService.addToWishlist(userId, foodId);
        return ResponseEntity.ok(Map.of("message", "Added to wishlist"));
    }

    @DeleteMapping("/user/{userId}/food/{foodId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long userId, @PathVariable Long foodId) {
        wishlistService.removeFromWishlist(userId, foodId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }
}
