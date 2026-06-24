package com.example.food_application.DTO;

import com.example.food_application.Entity.Food;

public class CartItemDto {
    private Long id;
    private Long userId;
    private Food food;
    private int quantity;

    public CartItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Food getFood() { return food; }
    public void setFood(Food food) { this.food = food; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
