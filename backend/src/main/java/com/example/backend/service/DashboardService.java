package com.example.backend.service;

import com.example.backend.dto.response.DashboardResponse;
import com.example.backend.model.Order;
import com.example.backend.model.OrderItem;
import com.example.backend.model.StockItem;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.StockItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final StockItemRepository stockItemRepository;
    private final OrderItemRepository orderItemRepository;

    public DashboardResponse getDashboard() {
        long totalProduct = productRepository.count();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        List<Order> todayOrderList = orderRepository.findByOrderedAtBetween(startOfDay, endOfDay);
        long todayOrders = todayOrderList.size();

        BigDecimal todaySales = todayOrderList.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO,BigDecimal::add);

        List<StockItem> allStock = stockItemRepository.findAll();
        List<StockItem> lowStock = allStock.stream()
                .filter(s -> s.getQuantity() <= s.getProductVariant().getLowStockAlert())
                .collect(Collectors.toList());

        long lowStockCount = lowStock.size();

        List<DashboardResponse.LowStockItem> lowStockItems = lowStock.stream()
                .map(s -> new DashboardResponse.LowStockItem(
                        s.getProductVariant().getName(),
                        s.getProductVariant().getSku(),
                        s.getQuantity(),
                        s.getProductVariant().getLowStockAlert()
                ))
                .collect(Collectors.toList());

        List<OrderItem> allOrderItems = orderItemRepository.findAll();
        Map<String,Integer> soldMap = allOrderItems.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getProductVariant().getSku(),
                        Collectors.summingInt(OrderItem::getQuantity)
                ));

        List<DashboardResponse.TopSellingItem> topSellingItems = soldMap.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5).map(entry -> {
                    OrderItem sample = allOrderItems.stream()
                            .filter(i -> i.getProductVariant().getSku().equals(entry.getKey()))
                            .findFirst().get();
                    return new DashboardResponse.TopSellingItem(
                            sample.getProductVariant().getName(),
                            entry.getKey(),
                            entry.getValue()
                    );
                })
                .collect(Collectors.toList());

        return new DashboardResponse(
                totalProduct,
                todayOrders,
                lowStockCount,
                todaySales,
                lowStockItems,
                topSellingItems
        );
    }
}
