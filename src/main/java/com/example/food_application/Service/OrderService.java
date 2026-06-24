package com.example.food_application.Service;

import com.example.food_application.DTO.OrderDto;
import java.util.List;

public interface OrderService {
    OrderDto placeOrder(Long userId, String deliveryAddress);
    List<OrderDto> getUserOrders(Long userId);
    OrderDto updateOrderStatus(Long id, String status);
}
