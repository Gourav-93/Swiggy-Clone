package com.example.food_application.Service;

import com.example.food_application.DTO.AddressDto;
import com.example.food_application.Entity.Address;
import com.example.food_application.Entity.User;
import com.example.food_application.Repository.AddressRepository;
import com.example.food_application.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public AddressDto addAddress(String email, AddressDto dto) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Address address = new Address(user, dto.getFullName(), dto.getMobileNumber(), dto.getHouseNumber(), dto.getStreet(), dto.getCity(), dto.getState(), dto.getPincode(), dto.isDefault());
        
        if (dto.isDefault()) {
            List<Address> existing = addressRepository.findByUserId(user.getId());
            for (Address a : existing) {
                if (a.isDefault()) {
                    a.setDefault(false);
                    addressRepository.save(a);
                }
            }
        }
        
        Address saved = addressRepository.save(address);
        dto.setId(saved.getId());
        return dto;
    }

    public List<AddressDto> getUserAddresses(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return addressRepository.findByUserId(user.getId()).stream().map(a -> {
            AddressDto dto = new AddressDto();
            dto.setId(a.getId());
            dto.setFullName(a.getFullName());
            dto.setMobileNumber(a.getMobileNumber());
            dto.setHouseNumber(a.getHouseNumber());
            dto.setStreet(a.getStreet());
            dto.setCity(a.getCity());
            dto.setState(a.getState());
            dto.setPincode(a.getPincode());
            dto.setDefault(a.isDefault());
            return dto;
        }).collect(Collectors.toList());
    }
}
