import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { formatPhoneNumber } from "@/lib/phoneUtils";
import { useEffect, useState } from "react";

const PhoneInput = ({ value, onChange, countryCode, error }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // If the value is empty, don't try to format it
    if (!value) {
      setDisplayValue('');
      return;
    }
    
    // Format the phone number based on input value and country code
    const formatted = formatPhoneNumber(value, countryCode);
    setDisplayValue(formatted);
  }, [value, countryCode]);

  const handleChange = (e) => {
    const input = e.target.value;
    // Remove all non-numeric characters for internal value
    const numericValue = input.replace(/\D/g, '');
    onChange(numericValue);
  };

  return (
    <div className="relative">
      <Input
        type="tel"
        className={`w-full px-4 py-6 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
        placeholder={countryCode === '+1' ? '(555) 123-4567' : 'Enter phone number'}
        value={displayValue}
        onChange={handleChange}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Phone className="h-5 w-5" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default PhoneInput;
