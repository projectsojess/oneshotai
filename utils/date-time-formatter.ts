// utils/dateFormatter.ts

export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
  
    // Options for the date formatting
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
    // Use Intl.DateTimeFormat for localization support
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  
  // Usage example:
  // const readableDate = formatDate('2024-08-07 13:27:17.997996+00');
  // console.log(readableDate); // Output: August 7, 2024 at 01:27 PM