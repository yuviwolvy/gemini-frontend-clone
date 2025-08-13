import React, { useState, useRef, useEffect } from "react";
import { type Country } from "../../types";
import { ChevronDown, Search } from "lucide-react";

interface CountrySelectProps {
  countries: Country[];
  value: string;
  onChange: (dialCode: string) => void;
  disabled?: boolean;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  countries,
  value,
  onChange,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    countries.find((c) => c.dialCode === value) ||
    countries.find((c) => c.dialCode === "+91");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dialCode.includes(searchTerm)
  );

  return (
    <div className="relative w-28 sm:w-36 flex-shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="relative w-full h-full cursor-pointer rounded-l-md border border-r-0 border-gray-300 bg-white py-3 pl-2 pr-8 sm:pl-3 sm:pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 sm:text-sm"
        disabled={disabled}
      >
        <span className="flex items-center">
          {selectedCountry && (
            <img
              src={selectedCountry.flagUrl}
              alt={`${selectedCountry.name} flag`}
              className="h-5 w-5 flex-shrink-0 rounded-full object-cover"
            />
          )}
          <span className="ml-2 sm:ml-3 block truncate dark:text-white">
            {selectedCountry?.dialCode}
          </span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-72 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 sm:text-sm">
          {" "}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-gray-300 p-2 pl-10 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
          </div>
          <ul className="max-h-48 overflow-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <li
                  key={country.name}
                  onClick={() => {
                    onChange(country.dialCode);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="relative flex cursor-pointer select-none items-center py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white dark:text-white dark:hover:bg-indigo-500"
                >
                  <img
                    src={country.flagUrl}
                    alt={`${country.name} flag`}
                    className="h-5 w-5 flex-shrink-0 rounded-full object-cover"
                  />
                  <span className="ml-3 block truncate font-normal">
                    {country.name}
                  </span>
                  <span className="ml-2 truncate text-gray-500 group-hover:text-gray-300">
                    {country.dialCode}
                  </span>
                </li>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500">No country found.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
