import { useState, useEffect } from "react";
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterState } from "@/lib/types";

interface SidebarFiltersProps {
  filterState: FilterState;
  setFilterState: (state: FilterState) => void;
  uniqueCountries: string[];
  uniqueCategories: string[];
  uniqueSegments: string[];
  uniqueRegions: string[];
  statesByCountry: Record<string, string[]>;
  isLoading: boolean;
}

export default function SidebarFilters({
  filterState,
  setFilterState,
  uniqueCountries,
  uniqueCategories,
  uniqueSegments,
  uniqueRegions,
  statesByCountry,
  isLoading,
}: SidebarFiltersProps) {
  // Convert empty filter strings to "all" for the select components
  const convertFilterStateForUI = (state: FilterState): FilterState => {
    return {
      ...state,
      country: state.country || 'all',
      category: state.category || 'all',
      segment: state.segment || 'all',
      region: state.region || 'all',
      state: state.state || 'all'
    };
  };
  
  const [localFilterState, setLocalFilterState] = useState<FilterState>(
    convertFilterStateForUI(filterState)
  );
  
  // Update local filter state when parent filter state changes
  useEffect(() => {
    setLocalFilterState(convertFilterStateForUI(filterState));
  }, [filterState]);
  
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setLocalFilterState({
      ...localFilterState,
      [field]: value ? new Date(value) : null
    });
  };
  
  const handleSelectChange = (field: keyof FilterState, value: string) => {
    // For the UI state, use the actual value including 'all'
    // We'll convert it back to '' when applying filters
    
    // Check if the field is 'state' first
    if (field === 'state') {
      // For state selection, auto-apply filter immediately
      const newState = {
        ...localFilterState,
        [field]: value
      };
      setLocalFilterState(newState);
      
      // Auto-apply for state filter
      const filtersToApply: FilterState = {
        ...newState,
        country: newState.country === 'all' ? '' : newState.country,
        category: newState.category === 'all' ? '' : newState.category,
        segment: newState.segment === 'all' ? '' : newState.segment,
        region: newState.region === 'all' ? '' : newState.region,
        state: newState.state === 'all' ? '' : newState.state
      };
      console.log('State filter changed to:', value);
      console.log('Applying filters with state:', filtersToApply.state);
      setFilterState(filtersToApply);
    }
    // Reset state if country changes
    else if (field === 'country' && value !== localFilterState.country) {
      const newState = {
        ...localFilterState,
        [field]: value,
        state: 'all' // Reset state to 'all' when country changes
      };
      setLocalFilterState(newState);
      
      // If auto-apply for country filter (immediately apply the filter)
      const filtersToApply: FilterState = {
        ...newState,
        country: newState.country === 'all' ? '' : newState.country,
        category: newState.category === 'all' ? '' : newState.category,
        segment: newState.segment === 'all' ? '' : newState.segment,
        region: newState.region === 'all' ? '' : newState.region,
        state: newState.state === 'all' ? '' : newState.state
      };
      setFilterState(filtersToApply);
    } else {
      setLocalFilterState({
        ...localFilterState,
        [field]: value
      });
    }
    
    console.log(`Changed ${field} to:`, value);
  };
  
  const clearFilters = () => {
    const clearedState: FilterState = {
      startDate: null,
      endDate: null,
      country: '',
      category: '',
      segment: '',
      region: '',
      state: ''
    };
    // Convert the empty strings to "all" for UI display
    setLocalFilterState(convertFilterStateForUI(clearedState));
    setFilterState(clearedState);
  };
  
  const applyFilters = () => {
    // Convert 'all' values back to empty strings for filtering
    const filtersToApply: FilterState = {
      ...localFilterState,
      country: localFilterState.country === 'all' ? '' : localFilterState.country,
      category: localFilterState.category === 'all' ? '' : localFilterState.category,
      segment: localFilterState.segment === 'all' ? '' : localFilterState.segment,
      region: localFilterState.region === 'all' ? '' : localFilterState.region,
      state: localFilterState.state === 'all' ? '' : localFilterState.state
    };
    console.log('Applying filters:', filtersToApply);
    setFilterState(filtersToApply);
  };
  
  return (
    <aside className="w-full md:w-80 bg-card shadow-md p-4 md:min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <Button 
          variant="ghost" 
          onClick={clearFilters} 
          className="text-primary hover:text-primary/80 text-sm font-medium px-2"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        {/* Date Range Filter */}
        <div className="filter-group">
          <Label className="text-sm font-medium text-muted-foreground mb-1">Date Range</Label>
          <div className="flex space-x-2">
            <div className="w-1/2">
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  type="date"
                  value={localFilterState.startDate ? new Date(localFilterState.startDate.getTime() - (localFilterState.startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full"
                />
              )}
            </div>
            <div className="w-1/2">
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  type="date"
                  value={localFilterState.endDate ? new Date(localFilterState.endDate.getTime() - (localFilterState.endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>

        {/* Country Filter */}
        <div className="filter-group">
          <Label htmlFor="countryFilter" className="text-sm font-medium text-muted-foreground mb-1">Country</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={localFilterState.country} 
              onValueChange={(value) => handleSelectChange('country', value)}
            >
              <SelectTrigger id="countryFilter" className="w-full">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Category Filter */}
        <div className="filter-group">
          <Label htmlFor="categoryFilter" className="text-sm font-medium text-muted-foreground mb-1">Category</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={localFilterState.category} 
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger id="categoryFilter" className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Segment Filter */}
        <div className="filter-group">
          <Label htmlFor="segmentFilter" className="text-sm font-medium text-muted-foreground mb-1">Segment</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={localFilterState.segment} 
              onValueChange={(value) => handleSelectChange('segment', value)}
            >
              <SelectTrigger id="segmentFilter" className="w-full">
                <SelectValue placeholder="All Segments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                {uniqueSegments.map((segment) => (
                  <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Region Filter */}
        <div className="filter-group">
          <Label htmlFor="regionFilter" className="text-sm font-medium text-muted-foreground mb-1">Region</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={localFilterState.region} 
              onValueChange={(value) => handleSelectChange('region', value)}
            >
              <SelectTrigger id="regionFilter" className="w-full">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {uniqueRegions.map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* State Filter */}
        <div className="filter-group">
          <Label htmlFor="stateFilter" className="text-sm font-medium text-muted-foreground mb-1">State/Region</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select 
              value={localFilterState.state} 
              onValueChange={(value) => handleSelectChange('state', value)}
              disabled={!localFilterState.country || localFilterState.country === 'all'}
            >
              <SelectTrigger id="stateFilter" className="w-full">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {localFilterState.country && localFilterState.country !== 'all' &&
                  statesByCountry[localFilterState.country]?.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Apply Filters Button */}
        <Button 
          onClick={applyFilters} 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          <FilterX className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
      </div>
    </aside>
  );
}
