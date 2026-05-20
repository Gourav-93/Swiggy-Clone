package com.example.food_application.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.food_application.Entity.Order;
import com.example.food_application.Repository.OrderRepository;
import com.example.food_application.Repository.CartRepository;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);
        cartRepository.deleteByUserId(order.getUserId());
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrders(@PathVariable Long userId) {
        List<Order> orders = orderRepository.findAll()
                .stream()
                .filter(o -> o.getUserId().equals(userId))
                .toList();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody Order order) {
        return orderRepository.findById(id).map(existing -> {
            existing.setStatus(order.getStatus());
            return ResponseEntity.ok(orderRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }
}
