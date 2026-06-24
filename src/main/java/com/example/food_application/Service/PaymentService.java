package com.example.food_application.Service;

import com.example.food_application.DTO.PaymentDto;
import com.example.food_application.Entity.Order;
import com.example.food_application.Entity.Payment;
import com.example.food_application.Entity.User;
import com.example.food_application.Repository.OrderRepository;
import com.example.food_application.Repository.PaymentRepository;
import com.example.food_application.Repository.UserRepository;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;

    @Value("${razorpay.key.id:mock_key}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:mock_secret}")
    private String razorpayKeySecret;

    public PaymentDto createPayment(String email, PaymentDto dto) {
        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            Order order = orderRepository.findById(dto.getOrderId()).orElseThrow(() -> new RuntimeException("Order not found"));

            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(dto.getAmount() * 100)); // amount in the smallest currency unit
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + order.getId());

            com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);
            String mockRazorpayId = razorpayOrder.get("id");

            order.setRazorpayOrderId(mockRazorpayId);
            order.setPaymentStatus("PENDING");
            orderRepository.save(order);

            Payment payment = new Payment(order, user, null, dto.getAmount(), "PENDING", dto.getPaymentMethod());
            paymentRepository.save(payment);

            dto.setTransactionId(mockRazorpayId); 
            return dto;
        } catch (Exception e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage());
        }
    }

    public void verifyPayment(String transactionId, String status) {
        Payment payment = paymentRepository.findByTransactionId(transactionId).orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(status);
        paymentRepository.save(payment);

        Order order = payment.getOrder();
        order.setPaymentStatus(status);
        if ("SUCCESS".equals(status)) {
            order.setStatus("CONFIRMED");
        }
        orderRepository.save(order);
    }
}
