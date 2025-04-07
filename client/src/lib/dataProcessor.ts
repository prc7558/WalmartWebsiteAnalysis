import { OrderData } from "./types";

export function processData(data: OrderData[]) {
  // Convert string dates to Date objects
  return data.map(item => ({
    ...item,
    OrderDate: typeof item.OrderDate === 'string' ? new Date(item.OrderDate).getTime() : item.OrderDate
  }));
}

export function getUniqueValues(data: OrderData[], field: keyof OrderData): string[] {
  const values = new Set<string>();
  
  data.forEach(item => {
    const value = item[field];
    if (typeof value === 'string') {
      values.add(value);
    }
  });
  
  return Array.from(values).sort();
}

export function getStatesByCountry(data: OrderData[]): Record<string, string[]> {
  const statesByCountry: Record<string, Set<string>> = {};
  
  data.forEach(item => {
    const country = item.Country;
    const state = item.State;
    
    if (!statesByCountry[country]) {
      statesByCountry[country] = new Set();
    }
    
    statesByCountry[country].add(state);
  });
  
  // Convert Sets to sorted arrays
  const result: Record<string, string[]> = {};
  for (const country in statesByCountry) {
    result[country] = Array.from(statesByCountry[country]).sort();
  }
  
  return result;
}

export function calculateTotalsByField(data: OrderData[], field: keyof OrderData): Record<string, number> {
  const totals: Record<string, number> = {};
  
  data.forEach(item => {
    const value = item[field] as string;
    const totalSales = item["Total Sales"];
    
    if (!totals[value]) {
      totals[value] = 0;
    }
    
    totals[value] += totalSales;
  });
  
  return totals;
}

export function calculateTotalsByPeriod(data: OrderData[], period: string): Record<string, number> {
  const totals: Record<string, number> = {};
  
  data.forEach(item => {
    const date = new Date(item.OrderDate);
    let periodKey: string;
    
    if (period === 'week') {
      // Get ISO week number
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      periodKey = `Week ${weekNumber}`;
    } else if (period === 'month') {
      periodKey = date.toLocaleString('default', { month: 'short' });
    } else if (period === 'quarter') {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      periodKey = `Q${quarter}`;
    } else if (period === 'year') {
      periodKey = date.getFullYear().toString();
    } else {
      periodKey = 'Unknown';
    }
    
    if (!totals[periodKey]) {
      totals[periodKey] = 0;
    }
    
    totals[periodKey] += item["Total Sales"];
  });
  
  return totals;
}

export function getTopCountriesBySales(data: OrderData[], limit: number = 5): { name: string, value: number, percentage: number }[] {
  // Group sales by country
  const salesByCountry: Record<string, number> = {};
  
  data.forEach(item => {
    const country = item.Country;
    const sales = item["Total Sales"];
    
    if (!salesByCountry[country]) {
      salesByCountry[country] = 0;
    }
    
    salesByCountry[country] += sales;
  });
  
  // Convert to array for sorting
  const countrySalesArray = Object.entries(salesByCountry).map(([name, value]) => ({ name, value }));
  
  // Sort by sales (descending)
  countrySalesArray.sort((a, b) => b.value - a.value);
  
  // Take top N countries
  const topCountries = countrySalesArray.slice(0, limit);
  
  // Calculate total sales for percentage
  const totalSales = topCountries.reduce((sum, country) => sum + country.value, 0);
  
  // Add percentage to each country
  return topCountries.map(country => ({
    ...country,
    percentage: Math.round((country.value / totalSales) * 100)
  }));
}

export function calculateSegmentDistribution(data: OrderData[]): Record<string, number> {
  // Group sales by segment
  const salesBySegment: Record<string, number> = {};
  let totalSales = 0;
  
  data.forEach(item => {
    const segment = item.Segment;
    const sales = item["Total Sales"];
    
    if (!salesBySegment[segment]) {
      salesBySegment[segment] = 0;
    }
    
    salesBySegment[segment] += sales;
    totalSales += sales;
  });
  
  // Convert to percentages
  const percentages: Record<string, number> = {};
  for (const segment in salesBySegment) {
    percentages[segment] = Math.round((salesBySegment[segment] / totalSales) * 100);
  }
  
  return percentages;
}

export function calculateShipModeDistribution(data: OrderData[]): Record<string, number> {
  // Group by ship mode
  const salesByShipMode: Record<string, number> = {};
  let totalSales = 0;
  
  data.forEach(item => {
    const shipMode = item["Ship Mode"];
    const sales = item["Total Sales"];
    
    if (!salesByShipMode[shipMode]) {
      salesByShipMode[shipMode] = 0;
    }
    
    salesByShipMode[shipMode] += sales;
    totalSales += sales;
  });
  
  // Convert to percentages
  const percentages: Record<string, number> = {};
  for (const shipMode in salesByShipMode) {
    percentages[shipMode] = Math.round((salesByShipMode[shipMode] / totalSales) * 100);
  }
  
  return percentages;
}

export function getMostProfitableProduct(data: OrderData[]): { product: string, profit: number, sales: number, category: string } {
  // Create a map to store aggregated product data
  const productMap: Record<string, { profit: number, sales: number, category: string }> = {};
  
  // Aggregate data by product name
  data.forEach(item => {
    const productName = item["Product Name"];
    const profit = item["Profit"];
    const sales = item["Total Sales"];
    const category = item["Category"];
    
    if (!productMap[productName]) {
      productMap[productName] = { profit: 0, sales: 0, category };
    }
    
    productMap[productName].profit += profit;
    productMap[productName].sales += sales;
  });
  
  // Find the product with the highest profit
  let mostProfitableProduct = "";
  let highestProfit = -Infinity;
  
  Object.entries(productMap).forEach(([product, data]) => {
    if (data.profit > highestProfit) {
      highestProfit = data.profit;
      mostProfitableProduct = product;
    }
  });
  
  return {
    product: mostProfitableProduct,
    profit: productMap[mostProfitableProduct]?.profit || 0,
    sales: productMap[mostProfitableProduct]?.sales || 0,
    category: productMap[mostProfitableProduct]?.category || ""
  };
}

export function getTopCustomer(data: OrderData[]): { name: string, totalSales: number, orderCount: number } {
  // Create a map to store customer data
  const customerMap: Record<string, { totalSales: number, orderIds: Set<number> }> = {};
  
  // Aggregate data by customer name
  data.forEach(item => {
    const customerName = item["Customer Name"];
    const sales = item["Total Sales"];
    const orderId = item["Order ID"];
    
    if (!customerMap[customerName]) {
      customerMap[customerName] = { totalSales: 0, orderIds: new Set() };
    }
    
    customerMap[customerName].totalSales += sales;
    customerMap[customerName].orderIds.add(orderId);
  });
  
  // Find the customer with the highest total sales
  let topCustomer = "";
  let highestSales = -Infinity;
  
  Object.entries(customerMap).forEach(([customer, data]) => {
    if (data.totalSales > highestSales) {
      highestSales = data.totalSales;
      topCustomer = customer;
    }
  });
  
  return {
    name: topCustomer,
    totalSales: customerMap[topCustomer]?.totalSales || 0,
    orderCount: customerMap[topCustomer]?.orderIds.size || 0
  };
}

export function getAllCountriesBySales(data: OrderData[]): { name: string, value: number, percentage: number }[] {
  // Group sales by country
  const salesByCountry: Record<string, number> = {};
  
  data.forEach(item => {
    const country = item.Country;
    const sales = item["Total Sales"];
    
    if (!salesByCountry[country]) {
      salesByCountry[country] = 0;
    }
    
    salesByCountry[country] += sales;
  });
  
  // Convert to array for sorting
  const countrySalesArray = Object.entries(salesByCountry).map(([name, value]) => ({ name, value }));
  
  // Sort by sales (descending)
  countrySalesArray.sort((a, b) => b.value - a.value);
  
  // Calculate total sales for percentage
  const totalSales = countrySalesArray.reduce((sum, country) => sum + country.value, 0);
  
  // Add percentage to each country
  return countrySalesArray.map(country => ({
    ...country,
    percentage: Math.round((country.value / totalSales) * 100)
  }));
}

export function calculateSubCategoryDistribution(data: OrderData[]): { labels: string[], values: number[] } {
  // Group sales by subcategory
  const salesBySubCategory: Record<string, number> = {};
  let totalSales = 0;
  
  data.forEach(item => {
    const subCategory = item["Sub-Category"];
    const sales = item["Total Sales"];
    
    if (!salesBySubCategory[subCategory]) {
      salesBySubCategory[subCategory] = 0;
    }
    
    salesBySubCategory[subCategory] += sales;
    totalSales += sales;
  });
  
  // Convert to array for sorting
  const subCategorySalesArray = Object.entries(salesBySubCategory)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  
  return {
    labels: subCategorySalesArray.map(item => item.label),
    values: subCategorySalesArray.map(item => item.value)
  };
}
