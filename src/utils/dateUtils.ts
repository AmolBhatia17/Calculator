// Calculate the difference between two dates
export const calculateDateDifference = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format');
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate years, months, and days
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Handle negative differences
  const isNegative = end.getTime() < start.getTime();
  if (isNegative) {
    years = -years;
    months = -months;
    days = -days;
  }

  // Calculate additional time units
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffWeeks = Math.floor(diffDays / 7);

  return `Time Difference:
${Math.abs(years)} years, ${Math.abs(months)} months, ${Math.abs(days)} days

Alternative formats:
• ${Math.abs(diffDays).toLocaleString()} days
• ${Math.abs(diffWeeks).toLocaleString()} weeks
• ${Math.abs(diffHours).toLocaleString()} hours
• ${Math.abs(diffMinutes).toLocaleString()} minutes
• ${Math.abs(diffSeconds).toLocaleString()} seconds

${isNegative ? '(End date is before start date)' : ''}`;
};

// Add time to a date
export const addTimeToDate = (
  dateString: string,
  years: number,
  months: number,
  days: number,
  hours: number,
  minutes: number
): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  newDate.setMonth(newDate.getMonth() + months);
  newDate.setDate(newDate.getDate() + days);
  newDate.setHours(newDate.getHours() + hours);
  newDate.setMinutes(newDate.getMinutes() + minutes);

  const dayName = newDate.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = newDate.toLocaleDateString('en-US', { month: 'long' });

  return `Result Date: ${dayName}, ${monthName} ${newDate.getDate()}, ${newDate.getFullYear()}

Added:
• ${years} years
• ${months} months  
• ${days} days
• ${hours} hours
• ${minutes} minutes

ISO Format: ${newDate.toISOString().split('T')[0]}
Full Date: ${newDate.toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}`;
};

// Subtract time from a date
export const subtractTimeFromDate = (
  dateString: string,
  years: number,
  months: number,
  days: number,
  hours: number,
  minutes: number
): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() - years);
  newDate.setMonth(newDate.getMonth() - months);
  newDate.setDate(newDate.getDate() - days);
  newDate.setHours(newDate.getHours() - hours);
  newDate.setMinutes(newDate.getMinutes() - minutes);

  const dayName = newDate.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = newDate.toLocaleDateString('en-US', { month: 'long' });

  return `Result Date: ${dayName}, ${monthName} ${newDate.getDate()}, ${newDate.getFullYear()}

Subtracted:
• ${years} years
• ${months} months
• ${days} days
• ${hours} hours
• ${minutes} minutes

ISO Format: ${newDate.toISOString().split('T')[0]}
Full Date: ${newDate.toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}`;
};

// Format date result for display
export const formatDateResult = (date: Date, operation: string): string => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });
  
  return `${operation} Result:
${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}

ISO Format: ${date.toISOString().split('T')[0]}
Day of Year: ${getDayOfYear(date)}
Week Number: ${getWeekNumber(date)}`;
};

// Get day of year
export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// Get week number
export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

// Check if year is leap year
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

// Get date information
export const getDateInfo = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });
  const dayOfYear = getDayOfYear(date);
  const weekNumber = getWeekNumber(date);
  const isLeap = isLeapYear(date.getFullYear());
  
  return `Date: ${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}
Day of Year: ${dayOfYear}
Week Number: ${weekNumber}
Leap Year: ${isLeap ? 'Yes' : 'No'}
Quarter: Q${Math.ceil((date.getMonth() + 1) / 3)}`;
};

// Calculate business days between dates
export const calculateBusinessDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    return 0;
  }
  
  let businessDays = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      businessDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return businessDays;
};