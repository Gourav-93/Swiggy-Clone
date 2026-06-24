package com.example.food_application.Controller;

import com.example.food_application.DTO.AdminDashboardDto;
import com.example.food_application.Entity.Order;
import com.example.food_application.Repository.FoodRepository;
import com.example.food_application.Repository.OrderRepository;
import com.example.food_application.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private FoodRepository foodRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardDto> getStats() {
        AdminDashboardDto stats = new AdminDashboardDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalOrders(orderRepository.count());
        stats.setTotalFoods(foodRepository.count());
        stats.setTotalCategories((long) foodRepository.findDistinctType().size());
        
        List<Order> orders = orderRepository.findAll();
        
        double revenue = 0.0;
        long pending = 0;
        long delivered = 0;
        
        for (Order o : orders) {
            if ("DELIVERED".equals(o.getStatus())) {
                delivered++;
                if (o.getTotalAmount() != null) {
                    revenue += o.getTotalAmount();
                }
            } else if ("PENDING".equals(o.getStatus()) || "PLACED".equals(o.getStatus())) {
                pending++;
            }
        }
        
        stats.setTotalRevenue(revenue);
        stats.setPendingOrders(pending);
        stats.setDeliveredOrders(delivered);
        
        return ResponseEntity.ok(stats);
    }
}
