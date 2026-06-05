package com.example.backend.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private long totalProducts;
    private long todayOrders;
    private long lowStockCount;
    private BigDecimal todaySales;
    private List<LowStockItem> lowStockItems;
    private List<TopSellingItem> topSellingItems;

    @Data
    @AllArgsConstructor
    public static class LowStockItem {
        private String variantName;
        private String sku;
        private int quantity;
        private int lowStockAlert;
    }

    @Data
    @AllArgsConstructor
    public static class TopSellingItem {
        private String variantName;
        private String sku;
        private int totalSold;
    }

}
