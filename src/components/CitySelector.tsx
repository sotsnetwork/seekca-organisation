import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  getCountries, 
  getStatesByCountry, 
  getCitiesByState, 
  getAllCitiesByCountry,
  searchCities,
  type City,
  type State,
  type Country
} from '@/data/cities';

interface CitySelectorProps {
  value?: string;
  onChange: (city: City | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CitySelector({ 
  value, 
  onChange, 
  placeholder = "Select city...",
  className,
  disabled = false
}: CitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  const countries = getCountries();
  const states = selectedCountry ? getStatesByCountry(selectedCountry) : [];
  const cities = selectedState ? getCitiesByState(selectedCountry, selectedState) : 
                selectedCountry ? getAllCitiesByCountry(selectedCountry) : [];

  // Initialize with current value
  useEffect(() => {
    if (value && !selectedCity) {
      // Try to find the city from the value string
      const allCities = countries.flatMap(country => 
        country.states.flatMap(state => state.cities)
      );
      const city = allCities.find(c => 
        c.name === value || 
        `${c.name}, ${c.state}` === value ||
        `${c.name}, ${c.state}, ${c.country}` === value
      );
      
      if (city) {
        setSelectedCity(city);
        setSelectedCountry(city.country);
        setSelectedState(city.state);
      }
    }
  }, [value, selectedCity, countries]);

  // Filter cities based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchCities(searchQuery, selectedCountry);
      setFilteredCities(results);
    } else {
      setFilteredCities(cities);
    }
  }, [searchQuery, selectedCountry, cities]);

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    setSelectedState('');
    setSelectedCity(null);
    setSearchQuery('');
    onChange(null);
  };

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedCity(null);
    setSearchQuery('');
    onChange(null);
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSearchQuery('');
    setOpen(false);
    onChange(city);
  };

  const displayValue = selectedCity 
    ? `${selectedCity.name}, ${selectedCity.state}`
    : placeholder;

  const citiesToShow = searchQuery.trim() ? filteredCities : cities;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Country Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Country</label>
        <Select 
          value={selectedCountry} 
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country..." />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State Selection (if country is selected) */}
      {selectedCountry && states.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">State/Province</label>
          <Select 
            value={selectedState} 
            onValueChange={handleStateChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state..." />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.name} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* City Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">City</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={disabled || !selectedCountry}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">
                  {displayValue}
                </span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search cities..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {searchQuery.trim() 
                    ? `No cities found for "${searchQuery}"`
                    : "No cities available. Please select a country first."
                  }
                </CommandEmpty>
                <CommandGroup>
                  {citiesToShow.map((city) => (
                    <CommandItem
                      key={`${city.name}-${city.state}-${city.country}`}
                      value={`${city.name} ${city.state} ${city.country}`}
                      onSelect={() => handleCitySelect(city)}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedCity?.name === city.name && 
                          selectedCity?.state === city.state
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{city.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {city.state}, {city.country}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected City Display */}
      {selectedCity && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {selectedCity.name}, {selectedCity.state}, {selectedCity.country}
            </span>
          </div>
          {selectedCity.coordinates && (
            <div className="text-xs text-muted-foreground mt-1">
              Coordinates: {selectedCity.coordinates.lat.toFixed(4)}, {selectedCity.coordinates.lng.toFixed(4)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
