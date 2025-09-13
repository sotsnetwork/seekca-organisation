// Comprehensive city data for location selection
export interface City {
  name: string;
  state: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface State {
  name: string;
  country: string;
  cities: City[];
}

export interface Country {
  name: string;
  code: string;
  states: State[];
}

// Major cities data for popular countries
export const citiesData: Country[] = [
  {
    name: "Nigeria",
    code: "NG",
    states: [
      {
        name: "Lagos",
        country: "Nigeria",
        cities: [
          { name: "Lagos", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.5244, lng: 3.3792 } },
          { name: "Ikeja", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.6059, lng: 3.3491 } },
          { name: "Victoria Island", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.4281, lng: 3.4219 } },
          { name: "Surulere", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.4994, lng: 3.3556 } },
          { name: "Yaba", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.4531, lng: 3.3958 } },
          { name: "Ikoyi", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.4528, lng: 3.4358 } },
          { name: "Lekki", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.4698, lng: 3.5852 } },
          { name: "Ajah", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.4531, lng: 3.6156 } },
          { name: "Badagry", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.4158, lng: 2.8853 } },
          { name: "Epe", state: "Lagos", country: "Nigeria", coordinates: { lat: 6.5833, lng: 3.9833 } }
        ]
      },
      {
        name: "Abuja",
        country: "Nigeria",
        cities: [
          { name: "Abuja", state: "Abuja", country: "Nigeria", coordinates: { lat: 9.0765, lng: 7.3986 } },
          { name: "Garki", state: "Abuja", country: "Nigeria", coordinates: { lat: 9.0500, lng: 7.4833 } },
          { name: "Wuse", state: "Abuja", country: "Nigeria", coordinates: { lat: 9.0667, lng: 7.4833 } },
          { name: "Asokoro", state: "Abuja", country: "Nigeria", coordinates: { lat: 9.0833, lng: 7.5167 } },
          { name: "Maitama", state: "Abuja", country: "Nigeria", coordinates: { lat: 9.1000, lng: 7.5000 } }
        ]
      },
      {
        name: "Rivers",
        country: "Nigeria",
        cities: [
          { name: "Port Harcourt", state: "Rivers", country: "Nigeria", coordinates: { lat: 4.8156, lng: 7.0498 } },
          { name: "Obio-Akpor", state: "Rivers", country: "Nigeria", coordinates: { lat: 4.8333, lng: 7.0167 } },
          { name: "Eleme", state: "Rivers", country: "Nigeria", coordinates: { lat: 4.7000, lng: 7.2000 } }
        ]
      },
      {
        name: "Kano",
        country: "Nigeria",
        cities: [
          { name: "Kano", state: "Kano", country: "Nigeria", coordinates: { lat: 12.0022, lng: 8.5920 } },
          { name: "Fagge", state: "Kano", country: "Nigeria", coordinates: { lat: 12.0167, lng: 8.5500 } },
          { name: "Nassarawa", state: "Kano", country: "Nigeria", coordinates: { lat: 12.0000, lng: 8.6000 } }
        ]
      },
      {
        name: "Ogun",
        country: "Nigeria",
        cities: [
          { name: "Abeokuta", state: "Ogun", country: "Nigeria", coordinates: { lat: 7.1557, lng: 3.3451 } },
          { name: "Sagamu", state: "Ogun", country: "Nigeria", coordinates: { lat: 6.8333, lng: 3.6500 } },
          { name: "Ijebu Ode", state: "Ogun", country: "Nigeria", coordinates: { lat: 6.8167, lng: 3.9167 } }
        ]
      }
    ]
  },
  {
    name: "United States",
    code: "US",
    states: [
      {
        name: "California",
        country: "United States",
        cities: [
          { name: "Los Angeles", state: "California", country: "United States", coordinates: { lat: 34.0522, lng: -118.2437 } },
          { name: "San Francisco", state: "California", country: "United States", coordinates: { lat: 37.7749, lng: -122.4194 } },
          { name: "San Diego", state: "California", country: "United States", coordinates: { lat: 32.7157, lng: -117.1611 } },
          { name: "Sacramento", state: "California", country: "United States", coordinates: { lat: 38.5816, lng: -121.4944 } },
          { name: "Fresno", state: "California", country: "United States", coordinates: { lat: 36.7378, lng: -119.7871 } },
          { name: "Long Beach", state: "California", country: "United States", coordinates: { lat: 33.7701, lng: -118.1937 } },
          { name: "Oakland", state: "California", country: "United States", coordinates: { lat: 37.8044, lng: -122.2712 } },
          { name: "Bakersfield", state: "California", country: "United States", coordinates: { lat: 35.3733, lng: -119.0187 } },
          { name: "Anaheim", state: "California", country: "United States", coordinates: { lat: 33.8366, lng: -117.9143 } },
          { name: "Santa Ana", state: "California", country: "United States", coordinates: { lat: 33.7455, lng: -117.8677 } }
        ]
      },
      {
        name: "New York",
        country: "United States",
        cities: [
          { name: "New York City", state: "New York", country: "United States", coordinates: { lat: 40.7128, lng: -74.0060 } },
          { name: "Buffalo", state: "New York", country: "United States", coordinates: { lat: 42.8864, lng: -78.8784 } },
          { name: "Rochester", state: "New York", country: "United States", coordinates: { lat: 43.1566, lng: -77.6088 } },
          { name: "Yonkers", state: "New York", country: "United States", coordinates: { lat: 40.9312, lng: -73.8988 } },
          { name: "Syracuse", state: "New York", country: "United States", coordinates: { lat: 43.0481, lng: -76.1474 } },
          { name: "Albany", state: "New York", country: "United States", coordinates: { lat: 42.6526, lng: -73.7562 } },
          { name: "New Rochelle", state: "New York", country: "United States", coordinates: { lat: 40.9115, lng: -73.7823 } },
          { name: "Mount Vernon", state: "New York", country: "United States", coordinates: { lat: 40.9126, lng: -73.8371 } },
          { name: "Schenectady", state: "New York", country: "United States", coordinates: { lat: 42.8142, lng: -73.9396 } },
          { name: "Utica", state: "New York", country: "United States", coordinates: { lat: 43.1009, lng: -75.2327 } }
        ]
      },
      {
        name: "Texas",
        country: "United States",
        cities: [
          { name: "Houston", state: "Texas", country: "United States", coordinates: { lat: 29.7604, lng: -95.3698 } },
          { name: "San Antonio", state: "Texas", country: "United States", coordinates: { lat: 29.4241, lng: -98.4936 } },
          { name: "Dallas", state: "Texas", country: "United States", coordinates: { lat: 32.7767, lng: -96.7970 } },
          { name: "Austin", state: "Texas", country: "United States", coordinates: { lat: 30.2672, lng: -97.7431 } },
          { name: "Fort Worth", state: "Texas", country: "United States", coordinates: { lat: 32.7555, lng: -97.3308 } },
          { name: "El Paso", state: "Texas", country: "United States", coordinates: { lat: 31.7619, lng: -106.4850 } },
          { name: "Arlington", state: "Texas", country: "United States", coordinates: { lat: 32.7357, lng: -97.1081 } },
          { name: "Corpus Christi", state: "Texas", country: "United States", coordinates: { lat: 27.8006, lng: -97.3964 } },
          { name: "Plano", state: "Texas", country: "United States", coordinates: { lat: 33.0198, lng: -96.6989 } },
          { name: "Lubbock", state: "Texas", country: "United States", coordinates: { lat: 33.5779, lng: -101.8552 } }
        ]
      },
      {
        name: "Florida",
        country: "United States",
        cities: [
          { name: "Miami", state: "Florida", country: "United States", coordinates: { lat: 25.7617, lng: -80.1918 } },
          { name: "Tampa", state: "Florida", country: "United States", coordinates: { lat: 27.9506, lng: -82.4572 } },
          { name: "Orlando", state: "Florida", country: "United States", coordinates: { lat: 28.5383, lng: -81.3792 } },
          { name: "Jacksonville", state: "Florida", country: "United States", coordinates: { lat: 30.3322, lng: -81.6557 } },
          { name: "St. Petersburg", state: "Florida", country: "United States", coordinates: { lat: 27.7676, lng: -82.6403 } },
          { name: "Hialeah", state: "Florida", country: "United States", coordinates: { lat: 25.8576, lng: -80.2781 } },
          { name: "Tallahassee", state: "Florida", country: "United States", coordinates: { lat: 30.4518, lng: -84.2807 } },
          { name: "Fort Lauderdale", state: "Florida", country: "United States", coordinates: { lat: 26.1224, lng: -80.1373 } },
          { name: "Port St. Lucie", state: "Florida", country: "United States", coordinates: { lat: 27.2730, lng: -80.3582 } },
          { name: "Cape Coral", state: "Florida", country: "United States", coordinates: { lat: 26.5629, lng: -81.9495 } }
        ]
      }
    ]
  },
  {
    name: "United Kingdom",
    code: "GB",
    states: [
      {
        name: "England",
        country: "United Kingdom",
        cities: [
          { name: "London", state: "England", country: "United Kingdom", coordinates: { lat: 51.5074, lng: -0.1278 } },
          { name: "Birmingham", state: "England", country: "United Kingdom", coordinates: { lat: 52.4862, lng: -1.8904 } },
          { name: "Manchester", state: "England", country: "United Kingdom", coordinates: { lat: 53.4808, lng: -2.2426 } },
          { name: "Liverpool", state: "England", country: "United Kingdom", coordinates: { lat: 53.4084, lng: -2.9916 } },
          { name: "Leeds", state: "England", country: "United Kingdom", coordinates: { lat: 53.8008, lng: -1.5491 } },
          { name: "Sheffield", state: "England", country: "United Kingdom", coordinates: { lat: 53.3811, lng: -1.4701 } },
          { name: "Bristol", state: "England", country: "United Kingdom", coordinates: { lat: 51.4545, lng: -2.5879 } },
          { name: "Newcastle", state: "England", country: "United Kingdom", coordinates: { lat: 54.9783, lng: -1.6178 } },
          { name: "Nottingham", state: "England", country: "United Kingdom", coordinates: { lat: 52.9548, lng: -1.1581 } },
          { name: "Leicester", state: "England", country: "United Kingdom", coordinates: { lat: 52.6369, lng: -1.1398 } }
        ]
      },
      {
        name: "Scotland",
        country: "United Kingdom",
        cities: [
          { name: "Edinburgh", state: "Scotland", country: "United Kingdom", coordinates: { lat: 55.9533, lng: -3.1883 } },
          { name: "Glasgow", state: "Scotland", country: "United Kingdom", coordinates: { lat: 55.8642, lng: -4.2518 } },
          { name: "Aberdeen", state: "Scotland", country: "United Kingdom", coordinates: { lat: 57.1497, lng: -2.0943 } },
          { name: "Dundee", state: "Scotland", country: "United Kingdom", coordinates: { lat: 56.4620, lng: -2.9707 } },
          { name: "Stirling", state: "Scotland", country: "United Kingdom", coordinates: { lat: 56.1165, lng: -3.9369 } }
        ]
      },
      {
        name: "Wales",
        country: "United Kingdom",
        cities: [
          { name: "Cardiff", state: "Wales", country: "United Kingdom", coordinates: { lat: 51.4816, lng: -3.1791 } },
          { name: "Swansea", state: "Wales", country: "United Kingdom", coordinates: { lat: 51.6214, lng: -3.9436 } },
          { name: "Newport", state: "Wales", country: "United Kingdom", coordinates: { lat: 51.5882, lng: -2.9977 } },
          { name: "Wrexham", state: "Wales", country: "United Kingdom", coordinates: { lat: 53.0466, lng: -2.9930 } },
          { name: "Barry", state: "Wales", country: "United Kingdom", coordinates: { lat: 51.3994, lng: -3.2631 } }
        ]
      }
    ]
  },
  {
    name: "Canada",
    code: "CA",
    states: [
      {
        name: "Ontario",
        country: "Canada",
        cities: [
          { name: "Toronto", state: "Ontario", country: "Canada", coordinates: { lat: 43.6532, lng: -79.3832 } },
          { name: "Ottawa", state: "Ontario", country: "Canada", coordinates: { lat: 45.4215, lng: -75.6972 } },
          { name: "Hamilton", state: "Ontario", country: "Canada", coordinates: { lat: 43.2557, lng: -79.8711 } },
          { name: "London", state: "Ontario", country: "Canada", coordinates: { lat: 42.9849, lng: -81.2453 } },
          { name: "Kitchener", state: "Ontario", country: "Canada", coordinates: { lat: 43.4501, lng: -80.4829 } },
          { name: "Windsor", state: "Ontario", country: "Canada", coordinates: { lat: 42.3149, lng: -83.0364 } },
          { name: "Oshawa", state: "Ontario", country: "Canada", coordinates: { lat: 43.8971, lng: -78.8658 } },
          { name: "Barrie", state: "Ontario", country: "Canada", coordinates: { lat: 44.3894, lng: -79.6903 } },
          { name: "Guelph", state: "Ontario", country: "Canada", coordinates: { lat: 43.5448, lng: -80.2482 } },
          { name: "Kingston", state: "Ontario", country: "Canada", coordinates: { lat: 44.2312, lng: -76.4860 } }
        ]
      },
      {
        name: "Quebec",
        country: "Canada",
        cities: [
          { name: "Montreal", state: "Quebec", country: "Canada", coordinates: { lat: 45.5017, lng: -73.5673 } },
          { name: "Quebec City", state: "Quebec", country: "Canada", coordinates: { lat: 46.8139, lng: -71.2080 } },
          { name: "Laval", state: "Quebec", country: "Canada", coordinates: { lat: 45.6066, lng: -73.7124 } },
          { name: "Gatineau", state: "Quebec", country: "Canada", coordinates: { lat: 45.4765, lng: -75.7013 } },
          { name: "Longueuil", state: "Quebec", country: "Canada", coordinates: { lat: 45.5312, lng: -73.5183 } },
          { name: "Sherbrooke", state: "Quebec", country: "Canada", coordinates: { lat: 45.4042, lng: -71.8929 } },
          { name: "Saguenay", state: "Quebec", country: "Canada", coordinates: { lat: 48.4281, lng: -71.0687 } },
          { name: "Lévis", state: "Quebec", country: "Canada", coordinates: { lat: 46.8033, lng: -71.1779 } },
          { name: "Trois-Rivières", state: "Quebec", country: "Canada", coordinates: { lat: 46.3432, lng: -72.5432 } },
          { name: "Terrebonne", state: "Quebec", country: "Canada", coordinates: { lat: 45.7000, lng: -73.6333 } }
        ]
      },
      {
        name: "British Columbia",
        country: "Canada",
        cities: [
          { name: "Vancouver", state: "British Columbia", country: "Canada", coordinates: { lat: 49.2827, lng: -123.1207 } },
          { name: "Victoria", state: "British Columbia", country: "Canada", coordinates: { lat: 48.4284, lng: -123.3656 } },
          { name: "Surrey", state: "British Columbia", country: "Canada", coordinates: { lat: 49.1913, lng: -122.8490 } },
          { name: "Burnaby", state: "British Columbia", country: "Canada", coordinates: { lat: 49.2488, lng: -122.9805 } },
          { name: "Richmond", state: "British Columbia", country: "Canada", coordinates: { lat: 49.1666, lng: -123.1336 } },
          { name: "Abbotsford", state: "British Columbia", country: "Canada", coordinates: { lat: 49.0504, lng: -122.3045 } },
          { name: "Coquitlam", state: "British Columbia", country: "Canada", coordinates: { lat: 49.2838, lng: -122.7932 } },
          { name: "Saanich", state: "British Columbia", country: "Canada", coordinates: { lat: 48.4840, lng: -123.3810 } },
          { name: "Delta", state: "British Columbia", country: "Canada", coordinates: { lat: 49.0847, lng: -122.8210 } },
          { name: "Kelowna", state: "British Columbia", country: "Canada", coordinates: { lat: 49.8880, lng: -119.4960 } }
        ]
      }
    ]
  },
  {
    name: "Germany",
    code: "DE",
    states: [
      {
        name: "Bavaria",
        country: "Germany",
        cities: [
          { name: "Munich", state: "Bavaria", country: "Germany", coordinates: { lat: 48.1351, lng: 11.5820 } },
          { name: "Nuremberg", state: "Bavaria", country: "Germany", coordinates: { lat: 49.4521, lng: 11.0767 } },
          { name: "Augsburg", state: "Bavaria", country: "Germany", coordinates: { lat: 48.3705, lng: 10.8978 } },
          { name: "Würzburg", state: "Bavaria", country: "Germany", coordinates: { lat: 49.7913, lng: 9.9534 } },
          { name: "Regensburg", state: "Bavaria", country: "Germany", coordinates: { lat: 49.0134, lng: 12.1016 } },
          { name: "Ingolstadt", state: "Bavaria", country: "Germany", coordinates: { lat: 48.7665, lng: 11.4258 } },
          { name: "Fürth", state: "Bavaria", country: "Germany", coordinates: { lat: 49.4773, lng: 10.9887 } },
          { name: "Erlangen", state: "Bavaria", country: "Germany", coordinates: { lat: 49.5897, lng: 11.0037 } },
          { name: "Bayreuth", state: "Bavaria", country: "Germany", coordinates: { lat: 49.9483, lng: 11.5783 } },
          { name: "Bamberg", state: "Bavaria", country: "Germany", coordinates: { lat: 49.8967, lng: 10.9003 } }
        ]
      },
      {
        name: "North Rhine-Westphalia",
        country: "Germany",
        cities: [
          { name: "Cologne", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 50.9375, lng: 6.9603 } },
          { name: "Düsseldorf", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 51.2277, lng: 6.7735 } },
          { name: "Dortmund", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 51.5136, lng: 7.4653 } },
          { name: "Essen", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 51.4556, lng: 7.0116 } },
          { name: "Duisburg", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 51.4344, lng: 6.7623 } },
          { name: "Bochum", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 51.4818, lng: 7.2162 } },
          { name: "Wuppertal", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 51.2562, lng: 7.1508 } },
          { name: "Bielefeld", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 52.0302, lng: 8.5325 } },
          { name: "Bonn", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 50.7374, lng: 7.0982 } },
          { name: "Münster", state: "North Rhine-Westphalia", country: "Germany", coordinates: { lat: 51.9607, lng: 7.6261 } }
        ]
      },
      {
        name: "Baden-Württemberg",
        country: "Germany",
        cities: [
          { name: "Stuttgart", state: "Baden-Württemberg", country: "Germany", coordinates: { lat: 48.7758, lng: 9.1829 } },
          { name: "Mannheim", state: "Baden-Württemberg", country: "Germany", coordinates: { lat: 49.4875, lng: 8.4660 } },
          { name: "Karlsruhe", state: "Baden-Württemberg", country: "Germany", coordinates: { lat: 49.0069, lng: 8.4037 } },
          { name: "Freiburg", state: "Baden-Württemberg", country: "Germany", coordinates: { lat: 47.9990, lng: 7.8421 } },
          { name: "Heidelberg", state: "Baden-Württemberg", country: "Germany", coordinates: { lat: 49.3988, lng: 8.6724 } },
          { name: "Ulm", state: "Baden-Württemberg", country: "Germany", coordinates: { lat: 48.4011, lng: 9.9876 } },
          { name: "Tübingen", state: "Baden-Württemberg", country: "Germany", coordinates: { lat: 48.5200, lng: 9.0556 } },
          { name: "Pforzheim", state: "Baden-Württemberg", country: "Germany", coordinates: { lat: 48.8944, lng: 8.7090 } },
          { name: "Reutlingen", state: "Baden-Württemberg", country: "Germany", coordinates: { lat: 48.4914, lng: 9.2042 } },
          { name: "Esslingen", state: "Baden-Württemberg", country: "Germany", coordinates: { lat: 48.7406, lng: 9.3068 } }
        ]
      }
    ]
  }
];

// Helper functions for city selection
export function getCountries(): Country[] {
  return citiesData;
}

export function getStatesByCountry(countryName: string): State[] {
  const country = citiesData.find(c => c.name === countryName);
  return country ? country.states : [];
}

export function getCitiesByState(countryName: string, stateName: string): City[] {
  const country = citiesData.find(c => c.name === countryName);
  if (!country) return [];
  
  const state = country.states.find(s => s.name === stateName);
  return state ? state.cities : [];
}

export function getAllCitiesByCountry(countryName: string): City[] {
  const states = getStatesByCountry(countryName);
  return states.flatMap(state => state.cities);
}

export function searchCities(query: string, countryName?: string): City[] {
  let cities: City[] = [];
  
  if (countryName) {
    cities = getAllCitiesByCountry(countryName);
  } else {
    cities = citiesData.flatMap(country => 
      country.states.flatMap(state => state.cities)
    );
  }
  
  return cities.filter(city => 
    city.name.toLowerCase().includes(query.toLowerCase()) ||
    city.state.toLowerCase().includes(query.toLowerCase())
  );
}

export function getCityByCoordinates(lat: number, lng: number, threshold: number = 0.1): City | null {
  const allCities = citiesData.flatMap(country => 
    country.states.flatMap(state => state.cities)
  );
  
  return allCities.find(city => {
    if (!city.coordinates) return false;
    const distance = Math.sqrt(
      Math.pow(city.coordinates.lat - lat, 2) + 
      Math.pow(city.coordinates.lng - lng, 2)
    );
    return distance <= threshold;
  }) || null;
}
