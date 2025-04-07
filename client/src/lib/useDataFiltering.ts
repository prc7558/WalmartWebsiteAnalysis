import { useMemo } from "react";
import { OrderData, FilterState } from "./types";
import { getUniqueValues, getStatesByCountry } from "./dataProcessor";

export function useDataFiltering(data: OrderData[], filterState: FilterState) {
  // Get filtered data based on filter state
  const filteredData = useMemo(() => {
    console.log('Filtering with state:', filterState);
    console.log('Data length before filtering:', data.length);
    return data.filter(item => {
      // Date filter
      if (filterState.startDate && new Date(item.OrderDate) < filterState.startDate) {
        return false;
      }
      if (filterState.endDate) {
        // Add one day to include the end date
        const endDatePlusOneDay = new Date(filterState.endDate);
        endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);
        if (new Date(item.OrderDate) >= endDatePlusOneDay) {
          return false;
        }
      }

      // Country filter
      if (filterState.country && item.Country !== filterState.country) {
        return false;
      }

      // State filter
      if (filterState.state) {
        console.log(`Comparing item.State (${item.State}) with filterState.state (${filterState.state})`);
        if (item.State !== filterState.state) {
          return false;
        }
      }

      // Category filter
      if (filterState.category && item.Category !== filterState.category) {
        return false;
      }

      // Segment filter
      if (filterState.segment && item.Segment !== filterState.segment) {
        return false;
      }

      // Region filter
      if (filterState.region && item.Region !== filterState.region) {
        return false;
      }

      return true;
    });
  }, [data, filterState]);
  
  // Log the filtered results
  console.log('Data length after filtering:', filteredData.length);

  // Get unique values for filter options
  const uniqueCountries = useMemo(() => getUniqueValues(data, "Country"), [data]);
  const uniqueCategories = useMemo(() => getUniqueValues(data, "Category"), [data]);
  const uniqueSegments = useMemo(() => getUniqueValues(data, "Segment"), [data]);
  const uniqueRegions = useMemo(() => getUniqueValues(data, "Region"), [data]);
  const statesByCountry = useMemo(() => getStatesByCountry(data), [data]);

  return {
    filteredData,
    uniqueCountries,
    uniqueCategories,
    uniqueSegments,
    uniqueRegions,
    statesByCountry
  };
}
