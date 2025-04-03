// Format phone number based on country code
export const formatPhoneNumber = (phoneNumber, countryCode) => {
  // Return empty string if the phone number is empty
  if (!phoneNumber) return '';
  
  // For US/Canada format: (XXX) XXX-XXXX
  if (countryCode === '+1') {
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  }
  
  // For UK format: XXXX XXXXXX
  if (countryCode === '+44') {
    if (phoneNumber.length <= 4) {
      return phoneNumber;
    } else {
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
    }
  }
  
  // For India format: XXXXX XXXXX
  if (countryCode === '+91') {
    if (phoneNumber.length <= 5) {
      return phoneNumber;
    } else {
      return `${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`;
    }
  }
  
  // For other countries, just add a space every 3 digits
  let formatted = '';
  for (let i = 0; i < phoneNumber.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formatted += ' ';
    }
    formatted += phoneNumber[i];
  }
  
  return formatted;
};

// Validate phone number (basic validation)
export const validatePhoneNumber = (phoneNumber, countryCode) => {
  if (!phoneNumber) return false;
  
  // Remove all non-numeric characters
  const numericValue = phoneNumber.replace(/\D/g, '');
  
  // Minimum length validation based on country
  const minLength = {
    '+1': 10,    // US/Canada
    '+44': 10,   // UK
    '+91': 10,   // India
    'default': 8 // Default minimum
  };
  
  const requiredLength = minLength[countryCode] || minLength.default;
  return numericValue.length >= requiredLength;
};
