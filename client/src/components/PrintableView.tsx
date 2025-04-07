import { useRef, useEffect } from 'react';
import { OrderData } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { DEFAULT_CURRENCY_FORMAT } from '@/lib/constants';
import { getAllCountriesBySales, calculateSubCategoryDistribution, 
         calculateTotalsByField, getMostProfitableProduct, getTopCustomer } from '@/lib/dataProcessor';
import { DataTable } from './DataTable';
import '@/lib/printStyles.css';

interface PrintableViewProps {
  data: OrderData[];
  isOpen: boolean;
  onClose: () => void;
}

export default function PrintableView({ data, isOpen, onClose }: PrintableViewProps) {
  const printContainerRef = useRef<HTMLDivElement>(null);
  
  // Format currency consistently
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', DEFAULT_CURRENCY_FORMAT).format(value);
  };
  
  // Calculate summary metrics
  const totalSales = data.reduce((sum, item) => sum + item['Total Sales'], 0);
  const totalProfit = data.reduce((sum, item) => sum + item.Profit, 0);
  const totalOrders = new Set(data.map(item => item['Order ID'])).size;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  // Get data for visualizations that will be displayed as tables
  const countriesData = getAllCountriesBySales(data);
  const subCategoryData = calculateSubCategoryDistribution(data);
  const categorySales = calculateTotalsByField(data, 'Category');
  const mostProfitableProduct = getMostProfitableProduct(data);
  const topCustomer = getTopCustomer(data);
  
  // Format categories for display
  const categoryItems = Object.entries(categorySales).map(([category, sales]) => ({
    category,
    sales,
    percentage: (sales / totalSales) * 100
  }));
  
  // Combine subcategory data
  const subCategoryItems = subCategoryData.labels.map((label, index) => ({
    subCategory: label,
    sales: subCategoryData.values[index]
  }));
  
  // Handle print functionality
  useEffect(() => {
    if (isOpen && printContainerRef.current) {
      // Add a larger delay to ensure all content is rendered
      const printTimeout = setTimeout(() => {
        const content = printContainerRef.current?.innerHTML || '';
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          console.error('Could not open print window');
          onClose();
          return;
        }
        
        // Set up the print window
        printWindow.document.open();
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Walmart Sales Dashboard - Print Report</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  color: black;
                  background: white;
                  margin: 0;
                  padding: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
                .page-break {
                  page-break-before: always;
                }
                h1 {
                  font-size: 24pt;
                }
                h2 {
                  font-size: 18pt;
                }
                .card {
                  border: 1px solid #ddd;
                  padding: 15px;
                  margin-bottom: 15px;
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
              ${content}
              <script>
                window.onload = function() {
                  window.print();
                  window.setTimeout(function() {
                    window.close();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        
        onClose();
      }, 800);
      
      return () => clearTimeout(printTimeout);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={printContainerRef}
      className="print-container p-8 bg-white text-black"
    >
      {/* Print Header */}
      <div className="print-header">
        <h1 className="text-3xl font-bold mb-2">Walmart Sales Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
      </div>
      
      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-muted-foreground">Total Sales</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-muted-foreground">Total Profit</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalProfit)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-muted-foreground">Total Orders</h3>
            <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm text-muted-foreground">Avg. Order Value</h3>
            <p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
          </CardContent>
        </Card>
      </section>
      
      {/* Category Table */}
      <section className="my-8">
        <h2 className="text-xl font-bold mb-4">Sales by Category</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border">Category</th>
              <th className="text-right p-2 border">Sales</th>
              <th className="text-right p-2 border">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {categoryItems.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border">{item.category}</td>
                <td className="text-right p-2 border">{formatCurrency(item.sales)}</td>
                <td className="text-right p-2 border">{item.percentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      {/* SubCategory Table */}
      <section className="my-8 page-break">
        <h2 className="text-xl font-bold mb-4">Sales by Sub-Category</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border">Sub-Category</th>
              <th className="text-right p-2 border">Sales</th>
            </tr>
          </thead>
          <tbody>
            {subCategoryItems.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border">{item.subCategory}</td>
                <td className="text-right p-2 border">{formatCurrency(item.sales)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      {/* Countries Table */}
      <section className="my-8 page-break">
        <h2 className="text-xl font-bold mb-4">Sales by Country</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border">Country</th>
              <th className="text-right p-2 border">Sales</th>
              <th className="text-right p-2 border">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {countriesData.map((country, index) => (
              <tr key={index}>
                <td className="p-2 border">{country.name}</td>
                <td className="text-right p-2 border">{formatCurrency(country.value)}</td>
                <td className="text-right p-2 border">{country.percentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      {/* Most Profitable Product */}
      <section className="my-8">
        <h2 className="text-xl font-bold mb-4">Most Profitable Product</h2>
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold">{mostProfitableProduct.product}</h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{mostProfitableProduct.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit</p>
                <p className="font-medium">{formatCurrency(mostProfitableProduct.profit)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sales</p>
                <p className="font-medium">{formatCurrency(mostProfitableProduct.sales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Top Customer */}
      <section className="my-8">
        <h2 className="text-xl font-bold mb-4">Top Customer</h2>
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold">{topCustomer.name}</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="font-medium">{formatCurrency(topCustomer.totalSales)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Count</p>
                <p className="font-medium">{topCustomer.orderCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Recent Orders Table */}
      <section className="my-8 page-break">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <DataTable data={data.slice(0, 10)} />
      </section>
      
      {/* Print Footer */}
      <div className="print-footer mt-8 text-center text-sm text-muted-foreground">
        <p>Walmart Sales Dashboard © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}