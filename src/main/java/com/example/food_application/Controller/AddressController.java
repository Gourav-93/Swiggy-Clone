package com.example.food_application.Controller;

import com.example.food_application.DTO.AddressDto;
import com.example.food_application.Service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping
    public ResponseEntity<AddressDto> addAddress(@RequestBody AddressDto dto, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(addressService.addAddress(email, dto));
    }

    @GetMapping
    public ResponseEntity<List<AddressDto>> getAddresses(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(addressService.getUserAddresses(email));
    }
}
