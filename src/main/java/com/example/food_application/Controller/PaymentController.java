package com.example.food_application.Controller;

import com.example.food_application.DTO.PaymentDto;
import com.example.food_application.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<PaymentDto> createPayment(@RequestBody PaymentDto dto, Authentication auth) {
        return ResponseEntity.ok(paymentService.createPayment(auth.getName(), dto));
    }

    @PostMapping("/verify")
    public ResponseEntity<Void> verifyPayment(@RequestParam String transactionId, @RequestParam String status) {
        paymentService.verifyPayment(transactionId, status);
        return ResponseEntity.ok().build();
    }
}
