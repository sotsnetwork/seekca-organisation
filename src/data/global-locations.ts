// Global locations data for EMEA, APAC, and AMER regions
export interface City {
  name: string;
  state: string;
  country: string;
  coordinates: { lat: number; lng: number };
}

export interface State {
  name: string;
  country: string;
  cities: City[];
}

export interface Country {
  name: string;
  code: string;
  region: 'EMEA' | 'APAC' | 'AMER';
  states: State[];
}

export const globalCountries: Country[] = [
  // EMEA Region
  {
    name: "Nigeria",
    code: "NG",
    region: "EMEA",
    states: [
      {
        name: "Lagos",
        country: "Nigeria",
        cities: [
          { name: "Lagos", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.5244, lng: 3.3792 } },
          { name: "Ikeja", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.6059, lng: 3.3491 } },
          { name: "Victoria Island", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.4281, lng: 3.4219 } },
          { name: "Surulere", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.4994, lng: 3.3556 } },
          { name: "Yaba", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.4531, lng: 3.3958 } }
        ]
      },
      {
        name: "Bayelsa",
        country: "Nigeria",
        cities: [
          { name: "Yenagoa", state: "Bayelsa", country: "Nigeria", coordinates: { lat: 4.9167, lng: 6.2667 } },
          { name: "Brass", state: "Bayelsa", country: "Nigeria", coordinates: { lat: 4.3167, lng: 6.2333 } },
          { name: "Ekeremor", state: "Bayelsa", country: "Nigeria", coordinates: { lat: 5.0500, lng: 5.7833 } }
        ]
      },
      {
        name: "FCT (Abuja)",
        country: "Nigeria",
        cities: [
          { name: "Abuja", state: "FCT (Abuja)", country: "Nigeria", coordinates: { lat: 9.0765, lng: 7.3986 } },
          { name: "Garki", state: "FCT (Abuja)", country: "Nigeria", coordinates: { lat: 9.0500, lng: 7.4833 } },
          { name: "Wuse", state: "FCT (Abuja)", country: "Nigeria", coordinates: { lat: 9.0667, lng: 7.4833 } }
        ]
      }
    ]
  },
  {
    name: "United Kingdom",
    code: "GB",
    region: "EMEA",
    states: [
      {
        name: "England",
        country: "United Kingdom",
        cities: [
          { name: "London", state: "England", country: "United Kingdom", coordinates: { lat: 51.5074, lng: -0.1278 } },
          { name: "Manchester", state: "England", country: "United Kingdom", coordinates: { lat: 53.4808, lng: -2.2426 } },
          { name: "Birmingham", state: "England", country: "United Kingdom", coordinates: { lat: 52.4862, lng: -1.8904 } },
          { name: "Liverpool", state: "England", country: "United Kingdom", coordinates: { lat: 53.4084, lng: -2.9916 } }
        ]
      },
      {
        name: "Scotland",
        country: "United Kingdom",
        cities: [
          { name: "Edinburgh", state: "Scotland", country: "United Kingdom", coordinates: { lat: 55.9533, lng: -3.1883 } },
          { name: "Glasgow", state: "Scotland", country: "United Kingdom", coordinates: { lat: 55.8642, lng: -4.2518 } }
        ]
      }
    ]
  },
  {
    name: "Germany",
    code: "DE",
    region: "EMEA",
    states: [
      {
        name: "Bavaria",
        country: "Germany",
        cities: [
          { name: "Munich", state: "Bavaria", country: "Germany", coordinates: { lat: 48.1351, lng: 11.5820 } },
          { name: "Nuremberg", state: "Bavaria", country: "Germany", coordinates: { lat: 49.4521, lng: 11.0767 } }
        ]
      },
      {
        name: "North Rhine-Westphalia",
        country: "Germany",
        cities: [
          { name: "Cologne", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 50.9375, lng: 6.9603 } },
          { name: "Düsseldorf", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 51.2277, lng: 6.7735 } }
        ]
      }
    ]
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    region: "EMEA",
    states: [
      {
        name: "Dubai",
        country: "United Arab Emirates",
        cities: [
          { name: "Dubai", state: "Dubai", country: "United Arab Emirates", coordinates: { lat: 25.2048, lng: 55.2708 } },
          { name: "Jumeirah", state: "Dubai", country: "United Arab Emirates", coordinates: { lat: 25.2048, lng: 55.2708 } }
        ]
      },
      {
        name: "Abu Dhabi",
        country: "United Arab Emirates",
        cities: [
          { name: "Abu Dhabi", state: "Abu Dhabi", country: "United Arab Emirates", coordinates: { lat: 24.4539, lng: 54.3773 } }
        ]
      }
    ]
  },

  // APAC Region
  {
    name: "India",
    code: "IN",
    region: "APAC",
    states: [
      {
        name: "Maharashtra",
        country: "India",
        cities: [
          { name: "Mumbai", state: "Maharashtra", country: "India", coordinates: { lat: 19.0760, lng: 72.8777 } },
          { name: "Pune", state: "Maharashtra", country: "India", coordinates: { lat: 18.5204, lng: 73.8567 } }
        ]
      },
      {
        name: "Karnataka",
        country: "India",
        cities: [
          { name: "Bangalore", state: "Karnataka", country: "India", coordinates: { lat: 12.9716, lng: 77.5946 } }
        ]
      }
    ]
  },
  {
    name: "Singapore",
    code: "SG",
    region: "APAC",
    states: [
      {
        name: "Singapore",
        country: "Singapore",
        cities: [
          { name: "Singapore", state: "Singapore", country: "Singapore", coordinates: { lat: 1.3521, lng: 103.8198 } },
          { name: "Marina Bay", state: "Singapore", country: "Singapore", coordinates: { lat: 1.2833, lng: 103.8500 } }
        ]
      }
    ]
  },
  {
    name: "Australia",
    code: "AU",
    region: "APAC",
    states: [
      {
        name: "New South Wales",
        country: "Australia",
        cities: [
          { name: "Sydney", state: "New South Wales", country: "Australia", coordinates: { lat: -33.8688, lng: 151.2093 } }
        ]
      },
      {
        name: "Victoria",
        country: "Australia",
        cities: [
          { name: "Melbourne", state: "Victoria", country: "Australia", coordinates: { lat: -37.8136, lng: 144.9631 } }
        ]
      }
    ]
  },
  {
    name: "Japan",
    code: "JP",
    region: "APAC",
    states: [
      {
        name: "Tokyo",
        country: "Japan",
        cities: [
          { name: "Tokyo", state: "Tokyo", country: "Japan", coordinates: { lat: 35.6762, lng: 139.6503 } },
          { name: "Shibuya", state: "Tokyo", country: "Japan", coordinates: { lat: 35.6580, lng: 139.7016 } }
        ]
      }
    ]
  },

  // AMER Region
  {
    name: "United States",
    code: "US",
    region: "AMER",
    states: [
      {
        name: "California",
        country: "United States",
        cities: [
          { name: "San Francisco", state: "California", country: "United States", coordinates: { lat: 37.7749, lng: -122.4194 } },
          { name: "Los Angeles", state: "California", country: "United States", coordinates: { lat: 34.0522, lng: -118.2437 } },
          { name: "San Diego", state: "California", country: "United States", coordinates: { lat: 32.7157, lng: -117.1611 } }
        ]
      },
      {
        name: "New York",
        country: "United States",
        cities: [
          { name: "New York City", state: "New York", country: "United States", coordinates: { lat: 40.7128, lng: -74.0060 } },
          { name: "Buffalo", state: "New York", country: "United States", coordinates: { lat: 42.8864, lng: -78.8784 } }
        ]
      },
      {
        name: "Texas",
        country: "United States",
        cities: [
          { name: "Houston", state: "Texas", country: "United States", coordinates: { lat: 29.7604, lng: -95.3698 } },
          { name: "Dallas", state: "Texas", country: "United States", coordinates: { lat: 32.7767, lng: -96.7970 } }
        ]
      }
    ]
  },
  {
    name: "Canada",
    code: "CA",
    region: "AMER",
    states: [
      {
        name: "Ontario",
        country: "Canada",
        cities: [
          { name: "Toronto", state: "Ontario", country: "Canada", coordinates: { lat: 43.6532, lng: -79.3832 } },
          { name: "Ottawa", state: "Ontario", country: "Canada", coordinates: { lat: 45.4215, lng: -75.6972 } }
        ]
      },
      {
        name: "British Columbia",
        country: "Canada",
        cities: [
          { name: "Vancouver", state: "British Columbia", country: "Canada", coordinates: { lat: 49.2827, lng: -123.1207 } }
        ]
      }
    ]
  },
  {
    name: "Brazil",
    code: "BR",
    region: "AMER",
    states: [
      {
        name: "São Paulo",
        country: "Brazil",
        cities: [
          { name: "São Paulo", state: "São Paulo", country: "Brazil", coordinates: { lat: -23.5505, lng: -46.6333 } }
        ]
      },
      {
        name: "Rio de Janeiro",
        country: "Brazil",
        cities: [
          { name: "Rio de Janeiro", state: "Rio de Janeiro", country: "Brazil", coordinates: { lat: -22.9068, lng: -43.1729 } }
        ]
      }
    ]
  }
];

// Helper functions
export const getCountriesByRegion = (region: 'EMEA' | 'APAC' | 'AMER') => {
  return globalCountries.filter(country => country.region === region);
};

export const getStatesByCountry = (countryName: string) => {
  const country = globalCountries.find(c => c.name === countryName);
  return country ? country.states : [];
};

export const getCitiesByState = (countryName: string, stateName: string) => {
  const country = globalCountries.find(c => c.name === countryName);
  if (!country) return [];
  
  const state = country.states.find(s => s.name === stateName);
  return state ? state.cities : [];
};

export const getAllCountries = () => {
  return globalCountries.map(country => ({
    name: country.name,
    code: country.code,
    region: country.region
  }));
};

export const getAllRegions = () => {
  return ['EMEA', 'APAC', 'AMER'];
};
