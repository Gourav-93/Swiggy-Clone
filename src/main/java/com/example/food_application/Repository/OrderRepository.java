package com.example.food_application.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.food_application.Entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long>{
    
}
