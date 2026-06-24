package com.example.food_application.DTO;

public class AdminDashboardDto {
    private Long totalUsers;
    private Long totalOrders;
    private Double totalRevenue;
    private Long totalFoods;
    private Long totalCategories;
    private Long pendingOrders;
    private Long deliveredOrders;

    public AdminDashboardDto() {}

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalFoods() { return totalFoods; }
    public void setTotalFoods(Long totalFoods) { this.totalFoods = totalFoods; }

    public Long getTotalCategories() { return totalCategories; }
    public void setTotalCategories(Long totalCategories) { this.totalCategories = totalCategories; }

    public Long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(Long pendingOrders) { this.pendingOrders = pendingOrders; }

    public Long getDeliveredOrders() { return deliveredOrders; }
    public void setDeliveredOrders(Long deliveredOrders) { this.deliveredOrders = deliveredOrders; }
}
