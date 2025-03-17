// Helper functions for Excel data processing

/**
 * Validates the imported data from an Excel file
 * @param {Array} data - Array of arrays containing rows of data from the Excel file
 * @returns {string|null} Error message if validation fails, null if valid
 */
export const validateImportedData = (data) => {
  // Check if there's any data
  if (!data || data.length === 0) {
    return "No data found in the file";
  }
  
  // Basic validation - each row should have at least a name
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows
    if (!row || row.length === 0 || (row.length === 1 && !row[0])) {
      continue;
    }
    
    // Each row should have at least one column (name)
    if (!row[0]) {
      return `Missing name in row ${i + 1}`;
    }
  }
  
  return null;
};

/**
 * Parses Excel data into person objects
 * @param {Array} data - Array of arrays containing rows of data from the Excel file
 * @returns {Array} Array of person objects with name, surname, and title
 */
export const parseExcelData = (data) => {
  return data
    .filter(row => row && row.length > 0 && row[0]) // Filter out empty rows
    .map(row => {
      // Map each row to a person object
      return {
        name: row[0] || "", // First column is name
        surname: row[1] || "", // Second column is surname (optional)
        title: row[2] || "", // Third column is title (optional)
      };
    });
};

/**
 * Converts person data to a format suitable for Excel export
 * @param {Array} people - Array of person objects
 * @returns {Array} Array of arrays for Excel export
 */
export const formatPeopleForExport = (people) => {
  // Add a header row
  const data = [["Name", "Surname", "Title"]];
  
  // Add data rows
  people.forEach(person => {
    data.push([
      person.name,
      person.surname,
      person.title
    ]);
  });
  
  return data;
}; 