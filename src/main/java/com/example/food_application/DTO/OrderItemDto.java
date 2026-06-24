package com.example.food_application.DTO;

public class OrderItemDto {
    private Long id;
    private Long foodId;
    private String foodName;
    private int quantity;
    private Double priceAtTimeOfOrder;

    public OrderItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public Double getPriceAtTimeOfOrder() { return priceAtTimeOfOrder; }
    public void setPriceAtTimeOfOrder(Double priceAtTimeOfOrder) { this.priceAtTimeOfOrder = priceAtTimeOfOrder; }
}
