package com.example.food_application.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.food_application.Entity.Order;
import com.example.food_application.Repository.OrderRepository;

public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/place")
    public Order placeOrder(@RequestBody Order order) {
        order.setStatus("PENDING");
        return orderRepository.save(order);
    }

    @GetMapping("/{userId}")
    public List<Order> getOrders(@PathVariable Long userId) {
        return orderRepository.findAll()
                .stream()
                .filter(o -> o.getUserId().equals(userId))
                .toList();
    }

    @PutMapping("/status/{id}")
    public Order updateStatus(@PathVariable Long id, @RequestBody Order order) {
        Order existing = orderRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setStatus(order.getStatus());
            return orderRepository.save(existing);
        }
        return null;
    }

}
