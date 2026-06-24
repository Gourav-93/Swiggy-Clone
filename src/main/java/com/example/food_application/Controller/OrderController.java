package com.example.food_application.Controller;

import com.example.food_application.DTO.OrderDto;
import com.example.food_application.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<OrderDto> placeOrder(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String deliveryAddress = payload.getOrDefault("deliveryAddress", "Default Address").toString();
        
        OrderDto orderDto = orderService.placeOrder(userId, deliveryAddress);
        return ResponseEntity.ok(orderDto);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDto>> getOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @Autowired
    private com.example.food_application.Repository.OrderRepository orderRepository;

    @PutMapping("/status/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.example.food_application.Entity.Order> updateOrderStatus(
            @PathVariable Long id, @RequestParam String status) {
        com.example.food_application.Entity.Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return ResponseEntity.ok(orderRepository.save(order));
    }
    
    @GetMapping("/track/{id}")
    public ResponseEntity<String> trackOrder(@PathVariable Long id) {
        com.example.food_application.Entity.Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return ResponseEntity.ok(order.getStatus());
    }
}
