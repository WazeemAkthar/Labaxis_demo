// Helper function to check if a value is within reference range
export function isValueInRange(value: string, referenceRange: string): boolean | null {
  if (!value || !referenceRange || value.trim() === "") return null;

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return null;

  // Handle ranges like "4.0-11.0" or "4.0 - 11.0"
  const rangeMatch = referenceRange.match(/(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return numValue >= min && numValue <= max;
  }

  // Handle "< X" ranges
  const lessThanMatch = referenceRange.match(/[<]\s*(\d+\.?\d*)/);
  if (lessThanMatch) {
    const max = parseFloat(lessThanMatch[1]);
    return numValue < max;
  }

  // Handle "> X" ranges
  const greaterThanMatch = referenceRange.match(/[>]\s*(\d+\.?\d*)/);
  if (greaterThanMatch) {
    const min = parseFloat(greaterThanMatch[1]);
    return numValue > min;
  }

  return null;
}

// Helper function to get indicator color classes
export function getValueIndicatorClass(value: string, referenceRange: string): string {
  const inRange = isValueInRange(value, referenceRange);
  
  if (inRange === null) return "";
  if (inRange) return "border-green-500 focus:ring-green-500";
  return "border-red-500 focus:ring-red-500";
}

// Helper function to get background color class
export function getBackgroundIndicatorClass(value: string, referenceRange: string): string {
  const inRange = isValueInRange(value, referenceRange);
  
  if (inRange === null) return "";
  if (inRange) return "bg-green-50";
  return "bg-red-50";
}