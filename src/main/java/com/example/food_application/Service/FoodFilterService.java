package com.example.food_application.Service;

import com.example.food_application.DTO.FoodFilterDto;
import com.example.food_application.Entity.Food;
import com.example.food_application.Repository.FoodRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FoodFilterService {

    @Autowired
    private FoodRepository foodRepository;

    public List<Food> getFilteredFoods(FoodFilterDto filter) {
        Specification<Food> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getSearch() != null && !filter.getSearch().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + filter.getSearch().toLowerCase() + "%"));
            }
            if (filter.getType() != null && !filter.getType().isEmpty()) {
                predicates.add(cb.equal(root.get("type"), filter.getType()));
            }
            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }
            if (filter.getIsVeg() != null) {
                predicates.add(cb.equal(root.get("isVeg"), filter.getIsVeg()));
            }
            if (filter.getMinRating() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), filter.getMinRating()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sort = Sort.unsorted();
        if (filter.getSortBy() != null) {
            switch (filter.getSortBy()) {
                case "price_asc":
                    sort = Sort.by(Sort.Direction.ASC, "price");
                    break;
                case "price_desc":
                    sort = Sort.by(Sort.Direction.DESC, "price");
                    break;
                case "rating":
                    sort = Sort.by(Sort.Direction.DESC, "rating");
                    break;
            }
        }

        return foodRepository.findAll(spec, sort);
    }
}
