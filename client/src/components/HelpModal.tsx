import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b pb-3">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold">Dashboard Help</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Getting Started</h4>
            <p className="text-sm text-muted-foreground">
              This dashboard provides an overview of sales data. Use the filters on the left to narrow down the data by various dimensions.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">Using Filters</h4>
            <p className="text-sm text-muted-foreground">
              Select values from the dropdown menus and click "Apply Filters" to update the dashboard. Use "Clear All" to reset filters.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">Data Visualizations</h4>
            <p className="text-sm text-muted-foreground">
              Hover over charts to see detailed information. Use the period selectors to change the time frame for trend analysis.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">Data Table</h4>
            <p className="text-sm text-muted-foreground">
              The table shows recent orders. Use the search box to find specific orders, and the sort dropdown to arrange them by different criteria.
            </p>
          </div>
        </div>
        
        <DialogFooter className="border-t pt-3 bg-muted/20">
          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
