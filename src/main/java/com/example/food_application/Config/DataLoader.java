package com.example.food_application.Config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.food_application.Entity.Food;
import com.example.food_application.Entity.User;
import com.example.food_application.Repository.FoodRepository;
import com.example.food_application.Repository.UserRepository;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(FoodRepository foodRepository, UserRepository userRepository) {
        return args -> {
            // Seed Foods if empty
            if (foodRepository.count() == 0) {
                foodRepository.saveAll(List.of(
                    new Food("Artisan Truffle Pizza", "Exquisite wild mushrooms, black truffle oil, and fresh mozzarella on a sourdough crust.", 649.0, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80", "Italian", "Artisan Crust"),
                    new Food("Burrata Prosciutto Pizza", "Creamy burrata, aged prosciutto, and organic arugula with balsamic glaze.", 799.0, "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&w=1200&q=80", "Italian", "Napoli Elite"),
                    new Food("Wagyu Gold Burger", "A5 Wagyu beef, gold-leaf cheddar, caramelized onions, and secret truffle aioli.", 899.0, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80", "Fast Food", "The Grill Master"),
                    new Food("Hyderabadi Dum Biryani", "Fragrant long-grain basmati rice slow-cooked with tender spiced meat and saffron.", 599.0, "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=1200&q=80", "Indian", "Royal Heritage"),
                    new Food("Belgian Dark Chocolate", "Velvety dark chocolate ice cream with a touch of Himalayan pink salt.", 229.0, "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80", "Dessert", "Cool Treats")
                ));
            }

            // Seed Admin User if not exists
            if (userRepository.findAll().stream().noneMatch(u -> "admin@foodie.com".equals(u.getEmail()))) {
                userRepository.save(new User("System Admin", "admin@foodie.com", "admin123", "ADMIN"));
            }

            System.out.println("Database seeded with culinary masterworks and administrative access.");
        };
    }
}
