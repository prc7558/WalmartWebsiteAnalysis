export interface OrderData {
  "Order ID": number;
  "OrderDate": number;
  "Customer Name": string;
  "Country": string;
  "State": string;
  "City": string;
  "Region": string;
  "Segment": string;
  "Ship Mode": string;
  "Category": string;
  "Sub-Category": string;
  "Product Name": string;
  "Discount": number;
  "Total Sales": number;
  "Profit": number;
  "Quantity": number;
  "Month": string;
}

export interface FilterState {
  startDate: Date | null;
  endDate: Date | null;
  country: string;
  category: string;
  segment: string;
  region: string;
  state: string;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface SummaryData {
  totalSales: number;
  totalProfit: number;
  totalOrders: number;
  avgOrderValue: number;
  salesChange: number;
  profitChange: number;
  ordersChange: number;
  aovChange: number;
}
