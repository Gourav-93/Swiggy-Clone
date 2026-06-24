package com.example.food_application.Service;

import com.example.food_application.Entity.CartItem;
import java.util.List;

public interface CartService {
    CartItem addToCart(CartItem cartItem);
    List<CartItem> getCartByUserId(Long userId);
    void removeFromCart(Long id);
    void clearCart(Long userId);
}
