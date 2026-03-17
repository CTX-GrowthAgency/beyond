/**
 * Date utility functions for consistent timezone handling across the application
 */

/**
 * Formats a date string or Date object consistently for display
 * Preserves the original timezone information
 */
export function formatDateForDisplay(dateInput: string | Date, options?: {
  includeTime?: boolean;
  locale?: string;
  format?: 'short' | 'long' | 'medium';
}) {
  const {
    includeTime = false,
    locale = 'en-IN',
    format = 'short'
  } = options || {};

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: format === 'short' ? 'short' : 'long',
    day: '2-digit',
    month: format === 'short' ? 'short' : 'long',
    year: 'numeric',
  };

  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
    formatOptions.hour12 = true;
  }

  return date.toLocaleDateString(locale, formatOptions);
}

/**
 * Formats a date string for event display (day, date, time)
 * Used consistently across event pages and components
 */
export function formatEventDate(dateStr: string) {
  // Parse the ISO date string properly to preserve timezone
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return {
      day: 'Invalid',
      date: 'Date',
      time: '',
    };
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day   = days[date.getDay()];
  const dd    = String(date.getDate()).padStart(2, "0");
  const mon   = months[date.getMonth()];
  const yyyy  = date.getFullYear();

  let hours   = date.getHours();
  const mins  = String(date.getMinutes()).padStart(2, "0");
  const ampm  = hours >= 12 ? "PM" : "AM";
  hours       = hours % 12 || 12;
  const time  = `${String(hours).padStart(2, "0")}:${mins} ${ampm}`;

  return {
    day,
    date: `${dd} ${mon} ${yyyy}`,
    time,
  };
}

/**
 * Converts a date string to Firestore Timestamp
 * Ensures consistent timezone handling
 */
export function dateToTimestamp(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  
  // Import dynamically to avoid server-side issues
  return import('firebase/firestore').then(({ Timestamp }) => 
    Timestamp.fromDate(date)
  );
}
