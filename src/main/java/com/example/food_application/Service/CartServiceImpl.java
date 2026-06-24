package com.example.food_application.Service;

import com.example.food_application.Entity.CartItem;
import com.example.food_application.Repository.CartRepository;
import com.example.food_application.Exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Override
    @Transactional
    public CartItem addToCart(CartItem cartItem) {
        return cartRepository.findByUserIdAndFoodId(cartItem.getUserId(), cartItem.getFoodId())
            .map(existing -> {
                existing.setQuantity(existing.getQuantity() + cartItem.getQuantity());
                return cartRepository.save(existing);
            })
            .orElseGet(() -> cartRepository.save(cartItem));
    }

    @Override
    public List<CartItem> getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void removeFromCart(Long id) {
        if (!cartRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cart item not found");
        }
        cartRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
}
