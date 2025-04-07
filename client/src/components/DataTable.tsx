import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderData } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEFAULT_CURRENCY_FORMAT } from "@/lib/constants";

interface DataTableProps {
  data: OrderData[];
}

export function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Filter data based on search term
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item["Customer Name"].toLowerCase().includes(searchTerm.toLowerCase()) || 
      item["Order ID"].toString().includes(searchTerm)
    );
  }, [data, searchTerm]);
  
  // Sort data based on selected option
  const sortedData = useMemo(() => {
    const dataToSort = [...filteredData];
    
    switch (sortOption) {
      case "date_desc":
        return dataToSort.sort((a, b) => b.OrderDate - a.OrderDate);
      case "date_asc":
        return dataToSort.sort((a, b) => a.OrderDate - b.OrderDate);
      case "total_desc":
        return dataToSort.sort((a, b) => b["Total Sales"] - a["Total Sales"]);
      case "total_asc":
        return dataToSort.sort((a, b) => a["Total Sales"] - b["Total Sales"]);
      default:
        return dataToSort;
    }
  }, [filteredData, sortOption]);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', DEFAULT_CURRENCY_FORMAT).format(value);
  };
  
  // Generate array of page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      // If total pages is less than max buttons, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if currentPage is near the beginning or end
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-foreground">Recent Orders</h3>
          <div className="flex items-center">
            <div className="relative mr-2">
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="py-1 px-3 text-sm pr-8 w-60"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm h-4 w-4" />
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="border rounded p-1 text-xs w-40">
                <SelectValue placeholder="Date (Newest)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date (Newest)</SelectItem>
                <SelectItem value="date_asc">Date (Oldest)</SelectItem>
                <SelectItem value="total_desc">Total (Highest)</SelectItem>
                <SelectItem value="total_asc">Total (Lowest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium text-muted-foreground">Order ID</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Customer</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Country</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Total</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((order) => {
                  return (
                    <TableRow key={order["Order ID"]} className="hover:bg-muted/50">
                      <TableCell className="text-sm">#{order["Order ID"]}</TableCell>
                      <TableCell className="text-sm">{formatDate(order.OrderDate)}</TableCell>
                      <TableCell className="text-sm">{order["Customer Name"]}</TableCell>
                      <TableCell className="text-sm">{order.Country}</TableCell>
                      <TableCell className="text-sm">{order.Category}</TableCell>
                      <TableCell className="text-sm font-medium">{formatCurrency(order["Total Sales"])}</TableCell>
                      <TableCell className={`text-sm ${order.Profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(order.Profit)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No orders found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredData.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> orders
            </div>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous page</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
              
              {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                  <Button
                    key={index}
                    variant={currentPage === page ? "default" : "outline"}
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ) : (
                  <span key={index} className="px-2 flex items-center">...</span>
                )
              ))}
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next page</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M6.1584 3.13514C5.95694 3.32401 5.94673 3.64042 6.13559 3.84188L9.565 7.49991L6.13559 11.1579C5.94673 11.3594 5.95694 11.6758 6.1584 11.8647C6.35986 12.0535 6.67627 12.0433 6.86514 11.8419L10.6151 7.84188C10.7954 7.64955 10.7954 7.35027 10.6151 7.15794L6.86514 3.15794C6.67627 2.95648 6.35986 2.94628 6.1584 3.13514Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
