package com.example.food_application.Service;

import com.example.food_application.Entity.Wishlist;
import java.util.List;

public interface WishlistService {
    List<Wishlist> getUserWishlist(Long userId);
    void addToWishlist(Long userId, Long foodId);
    void removeFromWishlist(Long userId, Long foodId);
}
