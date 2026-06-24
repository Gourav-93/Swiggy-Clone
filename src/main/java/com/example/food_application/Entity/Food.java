package com.example.food_application.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "foodDB")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.persistence.Column(nullable = false)
    private String name;

    @jakarta.persistence.Column(nullable = false)
    private String description;

    @jakarta.persistence.Column(nullable = false)
    private double price;

    private String image;

    @jakarta.persistence.Column(nullable = false)
    private String type;

    private String restaurant;
    
    private Double rating = 0.0;
    
    private Integer numReviews = 0;
    
    private boolean isVeg = true;

    public Food(String name, String description, double price, String image, String type, String restaurant) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.type = type;
        this.restaurant = restaurant;
    }

    public Food() {
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public String getImage() {
        return image;
    }

    public String getType() {
        return type;
    }

    public String getRestaurant() {
        return restaurant;
    }

    public Long getId() {
        return id;
    }
    
    public Double getRating() {
        return rating;
    }
    
    public Integer getNumReviews() {
        return numReviews;
    }
    
    public boolean isVeg() {
        return isVeg;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setRestaurant(String restaurant) {
        this.restaurant = restaurant;
    }
    
    public void setRating(Double rating) {
        this.rating = rating;
    }
    
    public void setNumReviews(Integer numReviews) {
        this.numReviews = numReviews;
    }
    
    public void setVeg(boolean isVeg) {
        this.isVeg = isVeg;
    }

}