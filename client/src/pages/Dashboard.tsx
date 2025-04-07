import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/AppHeader";
import SidebarFilters from "@/components/SidebarFilters";
import DataSummary from "@/components/DataSummary";
import DataVisualizations from "@/components/DataVisualizations";
import DataTable from "@/components/DataTable";
import HelpModal from "@/components/HelpModal";
import { FilterState } from "@/lib/types";
import { processData } from "@/lib/dataProcessor";
import { useDataFiltering } from "@/lib/useDataFiltering";

export default function Dashboard() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/data'],
    queryFn: async () => {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    }
  });
  
  const [filterState, setFilterState] = useState<FilterState>({
    startDate: null,
    endDate: null,
    country: '',
    category: '',
    segment: '',
    region: '',
    state: ''
  });
  
  const { 
    filteredData, 
    uniqueCountries, 
    uniqueCategories, 
    uniqueSegments, 
    uniqueRegions,
    statesByCountry
  } = useDataFiltering(data || [], filterState);
  
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark');
  };
  
  return (
    <div className={`min-h-screen ${isDarkTheme ? 'dark' : ''}`}>
      <AppHeader 
        onHelpClick={() => setShowHelpModal(true)} 
        onThemeToggle={toggleTheme}
        isDarkTheme={isDarkTheme}
      />
      
      <div className="flex flex-col md:flex-row min-h-screen">
        <SidebarFilters 
          filterState={filterState} 
          setFilterState={setFilterState}
          uniqueCountries={uniqueCountries}
          uniqueCategories={uniqueCategories}
          uniqueSegments={uniqueSegments}
          uniqueRegions={uniqueRegions}
          statesByCountry={statesByCountry}
          isLoading={isLoading}
        />
        
        <main className="flex-1 p-4 bg-background">
          {isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 text-red-500 rounded-lg">
              <h2 className="text-xl font-bold">Error Loading Data</h2>
              <p>{(error as Error).message}</p>
            </div>
          ) : (
            <>
              <DataSummary data={filteredData} />
              <DataVisualizations data={filteredData} />
              <DataTable data={filteredData} />
            </>
          )}
        </main>
      </div>
      
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
}
