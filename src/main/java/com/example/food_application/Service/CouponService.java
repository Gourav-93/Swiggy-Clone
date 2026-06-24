package com.example.food_application.Service;

import com.example.food_application.DTO.CouponDto;
import com.example.food_application.Entity.Coupon;
import com.example.food_application.Repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    public Coupon createCoupon(CouponDto dto) {
        Coupon coupon = new Coupon(dto.getCode(), dto.getDiscountPercentage(), dto.getMaxDiscount(), dto.getExpiryDate(), dto.isActive());
        return couponRepository.save(coupon);
    }

    public Coupon validateCoupon(String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        
        if (!coupon.isActive()) {
            throw new RuntimeException("Coupon is not active");
        }
        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Coupon has expired");
        }
        return coupon;
    }
}
