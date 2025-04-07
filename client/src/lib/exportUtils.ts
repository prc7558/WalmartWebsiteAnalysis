import { OrderData } from "./types";

export type ExportFormat = 'csv' | 'json';

/**
 * Convert order data to CSV format
 */
export function convertToCSV(data: OrderData[]): string {
  if (data.length === 0) {
    return '';
  }

  // Get all column headers
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = headers.join(',');
  
  // Create CSV data rows
  const rows = data.map(row => {
    return headers.map(header => {
      const value = row[header as keyof OrderData];
      
      // Handle different data types for CSV formatting
      if (typeof value === 'string') {
        // Wrap strings in quotes and escape any quotes in the string
        return `"${value.replace(/"/g, '""')}"`;
      } else if (typeof value === 'number') {
        // Check if it's a timestamp (date in milliseconds)
        if (header === 'OrderDate') {
          // Format as ISO date string
          const date = new Date(value);
          return `"${date.toISOString()}"`;
        }
        // Format numbers without quotes
        return value.toString();
      } else if (value === null || value === undefined) {
        return '';
      } else {
        // For any other type, convert to string
        return `"${String(value).replace(/"/g, '""')}"`;
      }
    }).join(',');
  });
  
  // Combine header and rows
  return [headerRow, ...rows].join('\n');
}

/**
 * Convert order data to JSON format
 */
export function convertToJSON(data: OrderData[]): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Export data to a file
 */
export function exportData(data: OrderData[], format: ExportFormat, filename?: string): void {
  if (!data.length) {
    console.error('No data to export');
    return;
  }
  
  let content: string;
  let mimeType: string;
  let fileExtension: string;
  
  // Convert data based on selected format
  if (format === 'csv') {
    content = convertToCSV(data);
    mimeType = 'text/csv';
    fileExtension = 'csv';
  } else {
    content = convertToJSON(data);
    mimeType = 'application/json';
    fileExtension = 'json';
  }
  
  // Create a downloadable blob
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename || 'walmart_data_export'}.${fileExtension}`;
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}