import { useDataSummary } from "@/hooks/useDataSummary";
import { EuroIcon, TrendingDown, TrendingUp, ShoppingCart, Receipt } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { OrderData } from "@/lib/types";

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-EU', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Sales</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalSales)}</h3>
                <p className={`text-xs ${salesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {salesChange >= 0 ? 
                    <TrendingUp className="inline mr-1 h-3 w-3" /> : 
                    <TrendingDown className="inline mr-1 h-3 w-3" />
                  }
                  {Math.abs(salesChange).toFixed(1)}% vs previous period
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <EuroIcon className="text-primary text-xl" />
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
                <p className={`text-xs ${profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitChange >= 0 ? 
                    <TrendingUp className="inline mr-1 h-3 w-3" /> : 
                    <TrendingDown className="inline mr-1 h-3 w-3" />
                  }
                  {Math.abs(profitChange).toFixed(1)}% vs previous period
                </p>
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
                <p className={`text-xs ${ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ordersChange >= 0 ? 
                    <TrendingUp className="inline mr-1 h-3 w-3" /> : 
                    <TrendingDown className="inline mr-1 h-3 w-3" />
                  }
                  {Math.abs(ordersChange).toFixed(1)}% vs previous period
                </p>
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
                <p className={`text-xs ${aovChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {aovChange >= 0 ? 
                    <TrendingUp className="inline mr-1 h-3 w-3" /> : 
                    <TrendingDown className="inline mr-1 h-3 w-3" />
                  }
                  {Math.abs(aovChange).toFixed(1)}% vs previous period
                </p>
              </div>
              <div className="bg-amber-100 p-2 rounded-lg">
                <Receipt className="text-amber-600 text-xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
