import { useMemo } from "react";
import { OrderData, ChartData } from "@/lib/types";
import { 
  calculateTotalsByField, 
  calculateTotalsByPeriod, 
  getTopCountriesBySales,
  getAllCountriesBySales,
  calculateSegmentDistribution,
  calculateShipModeDistribution,
  calculateSubCategoryDistribution
} from "@/lib/dataProcessor";
import { MONTHS } from "@/lib/constants";

export function useChartData(
  data: OrderData[], 
  salesTrendPeriod: string
) {
  // Calculate data for the category chart
  const categoryChartData = useMemo<ChartData>(() => {
    const categories = Array.from(new Set(data.map(item => item.Category)));
    const totals = calculateTotalsByField(data, 'Category');
    
    return {
      labels: categories,
      values: categories.map(category => totals[category] || 0)
    };
  }, [data]);
  
  // Calculate data for the sales trend chart
  const salesTrendChartData = useMemo<ChartData>(() => {
    const totals = calculateTotalsByPeriod(data, salesTrendPeriod);
    
    if (salesTrendPeriod === 'month') {
      // Ensure all months are represented in the right order
      const monthlyTotals: Record<string, number> = {};
      MONTHS.forEach(month => {
        monthlyTotals[month] = totals[month] || 0;
      });
      
      return {
        labels: MONTHS,
        values: MONTHS.map(month => monthlyTotals[month])
      };
    } else {
      // For other periods, use the calculated totals directly
      const labels = Object.keys(totals);
      const values = Object.values(totals);
      
      // Sort by period
      const sortedData = labels.map((label, index) => ({ label, value: values[index] }));
      
      if (salesTrendPeriod === 'week') {
        sortedData.sort((a, b) => {
          const weekA = parseInt(a.label.replace('Week ', ''));
          const weekB = parseInt(b.label.replace('Week ', ''));
          return weekA - weekB;
        });
      } else if (salesTrendPeriod === 'quarter') {
        sortedData.sort((a, b) => {
          const quarterA = parseInt(a.label.replace('Q', ''));
          const quarterB = parseInt(b.label.replace('Q', ''));
          return quarterA - quarterB;
        });
      }
      
      return {
        labels: sortedData.map(item => item.label),
        values: sortedData.map(item => item.value)
      };
    }
  }, [data, salesTrendPeriod]);
  
  // Get top countries by sales
  const topCountriesData = useMemo(() => {
    return getTopCountriesBySales(data, 5);
  }, [data]);
  
  // Calculate segment distribution
  const segmentChartData = useMemo<ChartData>(() => {
    const distribution = calculateSegmentDistribution(data);
    const segments = Object.keys(distribution);
    
    return {
      labels: segments,
      values: segments.map(segment => distribution[segment])
    };
  }, [data]);
  
  // Calculate ship mode distribution
  const shipModeChartData = useMemo<ChartData>(() => {
    const distribution = calculateShipModeDistribution(data);
    const shipModes = Object.keys(distribution);
    
    return {
      labels: shipModes,
      values: shipModes.map(mode => distribution[mode])
    };
  }, [data]);
  
  // Get all countries by sales for pie chart
  const allCountriesData = useMemo(() => {
    return getAllCountriesBySales(data);
  }, [data]);
  
  // Get subcategory distribution for bar chart
  const subCategoryChartData = useMemo(() => {
    return calculateSubCategoryDistribution(data);
  }, [data]);
  
  return {
    categoryChartData,
    salesTrendChartData,
    topCountriesData,
    segmentChartData,
    shipModeChartData,
    allCountriesData,
    subCategoryChartData
  };
}
