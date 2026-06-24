package com.example.food_application.DTO;

public class FoodFilterDto {
    private String search;
    private String type;
    private Double minPrice;
    private Double maxPrice;
    private Boolean isVeg;
    private Double minRating;
    private String sortBy; // price_asc, price_desc, rating

    public FoodFilterDto() {}

    public String getSearch() { return search; }
    public void setSearch(String search) { this.search = search; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Double getMinPrice() { return minPrice; }
    public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }
    public Double getMaxPrice() { return maxPrice; }
    public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }
    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean isVeg) { this.isVeg = isVeg; }
    public Double getMinRating() { return minRating; }
    public void setMinRating(Double minRating) { this.minRating = minRating; }
    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }
}
