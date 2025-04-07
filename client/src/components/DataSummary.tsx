import { useDataSummary } from "@/hooks/useDataSummary";
import { DollarSign, TrendingDown, TrendingUp, ShoppingCart, Receipt, Award, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { OrderData } from "@/lib/types";
import { getMostProfitableProduct, getTopCustomer } from "@/lib/dataProcessor";
import { DEFAULT_CURRENCY_FORMAT } from "@/lib/constants";

interface DataSummaryProps {
  data: OrderData[];
}

export default function DataSummary({ data }: DataSummaryProps) {
  const { 
    totalSales, 
    totalProfit, 
    totalOrders, 
    avgOrderValue,
    salesChange,
    profitChange,
    ordersChange,
    aovChange
  } = useDataSummary(data);

  // Get most profitable product and top customer
  const mostProfitableProduct = getMostProfitableProduct(data);
  const topCustomer = getTopCustomer(data);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', DEFAULT_CURRENCY_FORMAT).format(value);
  };
  
  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Total Sales Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Sales</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalSales)}</h3>

              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <DollarSign className="text-primary text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Profit Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Profit</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalProfit)}</h3>

              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="text-green-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <h3 className="text-2xl font-bold text-foreground">{totalOrders.toLocaleString()}</h3>

              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <ShoppingCart className="text-purple-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Order Value */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg. Order Value</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(avgOrderValue)}</h3>

              </div>
              <div className="bg-amber-100 p-2 rounded-lg">
                <Receipt className="text-amber-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Profitable Product and Top Customer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Profitable Product */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold">Most Profitable Product</h3>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Award className="text-indigo-600 text-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Product Name</p>
              <p className="font-medium text-foreground truncate" title={mostProfitableProduct.product}>
                {mostProfitableProduct.product}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium">{mostProfitableProduct.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Profit</p>
                  <p className="font-medium text-green-600">{formatCurrency(mostProfitableProduct.profit)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Customer */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold">Top Customer</h3>
              <div className="bg-rose-100 p-2 rounded-lg">
                <User className="text-rose-600 text-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p className="font-medium text-foreground truncate" title={topCustomer.name}>
                {topCustomer.name}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="font-medium">{topCustomer.orderCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                  <p className="font-medium text-blue-600">{formatCurrency(topCustomer.totalSales)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
