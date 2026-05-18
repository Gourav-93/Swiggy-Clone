package com.example.food_application.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.food_application.Entity.CartItem;
import com.example.food_application.Repository.CartRepository;

@RestController
@RequestMapping("/cart")
@CrossOrigin("*")
public class CartController 
{

    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/add")
    public CartItem addToCart(@RequestBody CartItem cart) {
        return cartRepository.save(cart);
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public String remove(@PathVariable Long id) {
        cartRepository.deleteById(id);
        return "Removed from cart";
    }
    
}
