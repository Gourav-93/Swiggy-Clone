package com.example.food_application.Service;

import com.example.food_application.Entity.Wishlist;
import com.example.food_application.Entity.User;
import com.example.food_application.Entity.Food;
import com.example.food_application.Repository.WishlistRepository;
import com.example.food_application.Repository.UserRepository;
import com.example.food_application.Repository.FoodRepository;
import com.example.food_application.Exception.ResourceNotFoundException;
import com.example.food_application.Exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Override
    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void addToWishlist(Long userId, Long foodId) {
        if (wishlistRepository.existsByUserIdAndFoodId(userId, foodId)) {
            throw new BadRequestException("Item already in wishlist");
        }
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Food food = foodRepository.findById(foodId)
            .orElseThrow(() -> new ResourceNotFoundException("Food not found"));

        Wishlist wishlist = new Wishlist(user, food);
        wishlistRepository.save(wishlist);
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long userId, Long foodId) {
        wishlistRepository.deleteByUserIdAndFoodId(userId, foodId);
    }
}
