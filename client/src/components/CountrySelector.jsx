import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Search } from "lucide-react";
import { countries } from "@/lib/countries";

const CountrySelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  );

  const handleSelectCountry = (country) => {
    onChange(country);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className="flex items-center space-x-3 mb-3 border rounded-lg p-3 cursor-pointer hover:border-primary transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-6 rounded overflow-hidden flex-shrink-0">
          <img 
            src={`https://flagcdn.com/${value.iso2.toLowerCase()}.svg`}
            alt={`${value.name} Flag`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow flex items-center justify-between">
          <div>
            <span className="font-medium">{value.name}</span>
            <span className="ml-2 text-gray-500">{value.code}</span>
          </div>
          <ChevronDown className="text-gray-400 h-4 w-4" />
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="sticky top-0 bg-white p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search countries..."
                className="w-full pl-9 pr-4 py-2 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <ScrollArea className="max-h-60">
            <div className="py-1">
              {filteredCountries.map((country) => (
                <div 
                  key={country.iso2}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectCountry(country)}
                >
                  <div className="w-6 h-4 rounded overflow-hidden">
                    <img 
                      src={`https://flagcdn.com/${country.iso2.toLowerCase()}.svg`}
                      alt={`${country.name} Flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{country.name}</span>
                  <span className="text-gray-500 ml-auto">{country.code}</span>
                </div>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No countries found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
