package com.example.food_application.Service;

import com.example.food_application.DTO.OrderDto;
import com.example.food_application.DTO.OrderItemDto;
import com.example.food_application.Entity.Order;
import com.example.food_application.Entity.OrderItem;
import com.example.food_application.Entity.User;
import com.example.food_application.Entity.CartItem;
import com.example.food_application.Entity.Food;
import com.example.food_application.Repository.OrderRepository;
import com.example.food_application.Repository.OrderItemRepository;
import com.example.food_application.Repository.UserRepository;
import com.example.food_application.Repository.CartRepository;
import com.example.food_application.Repository.FoodRepository;
import com.example.food_application.Exception.ResourceNotFoundException;
import com.example.food_application.Exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public OrderDto placeOrder(Long userId, String deliveryAddress) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Double totalAmount = 0.0;
        for (CartItem item : cartItems) {
            Food food = foodRepository.findById(item.getFoodId())
                .orElseThrow(() -> new ResourceNotFoundException("Food not found"));
            totalAmount += food.getPrice() * item.getQuantity();
        }

        Order order = new Order(user, "PENDING", totalAmount, deliveryAddress);
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            Food food = foodRepository.findById(cartItem.getFoodId()).orElseThrow();
            return new OrderItem(savedOrder, food, cartItem.getQuantity(), food.getPrice());
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);
        savedOrder.setItems(orderItems);

        cartRepository.deleteByUserId(userId);

        // Send Email Async or Sync
        emailService.sendOrderMail(user.getEmail(), savedOrder.getId());

        return mapToDto(savedOrder);
    }

    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> o.getUser().getId().equals(userId))
                .collect(Collectors.toList());
        return orders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long id, String status) {
        Order existing = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        existing.setStatus(status);
        return mapToDto(orderRepository.save(existing));
    }

    private OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getItems() != null) {
            List<OrderItemDto> itemDtos = order.getItems().stream().map(item -> {
                OrderItemDto itemDto = new OrderItemDto();
                itemDto.setId(item.getId());
                itemDto.setFoodId(item.getFood().getId());
                itemDto.setFoodName(item.getFood().getName());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setPriceAtTimeOfOrder(item.getPriceAtTimeOfOrder());
                return itemDto;
            }).collect(Collectors.toList());
            dto.setItems(itemDtos);
        }
        return dto;
    }
}
