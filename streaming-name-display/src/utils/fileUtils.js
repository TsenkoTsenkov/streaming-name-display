import { parseExcelData, validateImportedData } from './excelUtils';
import * as XLSX from 'xlsx';

// Handler for processing Excel files
export const handleExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        
        // Check file type and parse accordingly
        if (file.type === 'text/csv' || file.type === 'text/plain') {
          // Handle CSV files
          const rows = parseCSV(data);
          if (rows.length > 0) {
            const error = validateImportedData(rows);
            if (error) {
              reject(error);
              return;
            }
            
            const processedData = parseExcelData(rows);
            resolve(processedData);
            return;
          }
        } else if (isExcelFile(file)) {
          // For Excel files, try to parse the binary data
          try {
            // Parse Excel data using the XLSX library
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
              
            // Skip header row if it exists
            const dataRows = rows.length > 1 && isHeaderRow(rows[0]) ? rows.slice(1) : rows;
              
            if (dataRows.length > 0) {
              const error = validateImportedData(dataRows);
              if (error) {
                reject(error);
                return;
              }
                
              const processedData = parseExcelData(dataRows);
              resolve(processedData);
              return;
            }
          } catch (parseError) {
            console.error("Error parsing Excel:", parseError);
            
            // Fall back to CSV parsing if Excel parsing fails
            try {
              const textData = new TextDecoder().decode(new Uint8Array(data));
              const rows = parseCSV(textData);
              
              if (rows.length > 0) {
                const error = validateImportedData(rows);
                if (error) {
                  reject(error);
                  return;
                }
                
                const processedData = parseExcelData(rows);
                resolve(processedData);
                return;
              }
            } catch (csvError) {
              console.error("Fallback CSV parsing also failed:", csvError);
            }
          }
        }
        
        reject("Could not parse file. Please ensure it's a valid CSV or Excel file with proper formatting.");
      } catch (error) {
        console.error("Error processing file:", error);
        reject("Error processing file. Please check the file format.");
      }
    };
    
    reader.onerror = () => {
      reject("Error reading file");
    };
    
    // Read as text for CSV or as ArrayBuffer for Excel
    if (file.type === 'text/csv' || file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

// Helper function to parse CSV data
const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  return lines.map(line => {
    // Handle quoted CSV properly
    const result = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    result.push(currentValue.trim());
    
    return result;
  });
};

// Helper function to check if a row is a header row
const isHeaderRow = (row) => {
  // Check if the row contains common header names
  const headerKeywords = ['name', 'first', 'last', 'surname', 'title', 'position', 'role'];
  const rowStr = row.join(' ').toLowerCase();
  
  return headerKeywords.some(keyword => rowStr.includes(keyword));
};

// Helper function to check if a file is an Excel file
export const isExcelFile = (file) => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
    'application/csv', // .csv (alternative MIME type)
    'text/plain', // .txt
    'application/octet-stream', // Generic binary file (could be Excel)
    '', // Some browsers don't set a type
  ];
  
  // Check the file extension if MIME type is generic or empty
  if (file.type === 'application/octet-stream' || file.type === '') {
    const extension = file.name.split('.').pop().toLowerCase();
    return ['xlsx', 'xls', 'csv', 'txt'].includes(extension);
  }
  
  return validTypes.includes(file.type);
}; 