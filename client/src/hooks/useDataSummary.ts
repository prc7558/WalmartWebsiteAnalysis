import { useMemo } from "react";
import { OrderData, SummaryData } from "@/lib/types";

export function useDataSummary(data: OrderData[]): SummaryData {
  return useMemo(() => {
    // Calculate current period metrics
    const totalSales = data.reduce((sum, item) => sum + item["Total Sales"], 0);
    const totalProfit = data.reduce((sum, item) => sum + item.Profit, 0);
    const totalOrders = new Set(data.map(item => item["Order ID"])).size;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Simulate previous period metrics
    // In a real application, you would compare with actual historical data
    // For this example, we'll simulate previous period metrics with small variations
    const salesChange = simulateChange(5, 15);
    const profitChange = simulateChange(-5, 15);
    const ordersChange = simulateChange(3, 10);
    const aovChange = simulateChange(1, 5);
    
    return {
      totalSales,
      totalProfit,
      totalOrders,
      avgOrderValue,
      salesChange,
      profitChange,
      ordersChange,
      aovChange
    };
  }, [data]);
}

// Helper function to generate a random change percentage within a range
function simulateChange(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}
