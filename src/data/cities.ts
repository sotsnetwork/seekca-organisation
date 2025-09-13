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

import { nigeriaStates } from './nigeria-states';

// Comprehensive cities data for global coverage
export const citiesData: Country[] = [
  {
    name: "Nigeria",
    code: "NG",
    states: nigeriaStates
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
          { name: "Santa Ana", state: "California", country: "United States", coordinates: { lat: 33.7455, lng: -117.8677 } },
          { name: "Riverside", state: "California", country: "United States", coordinates: { lat: 33.9533, lng: -117.3962 } },
          { name: "Stockton", state: "California", country: "United States", coordinates: { lat: 37.9577, lng: -121.2908 } },
          { name: "Irvine", state: "California", country: "United States", coordinates: { lat: 33.6846, lng: -117.8265 } },
          { name: "Chula Vista", state: "California", country: "United States", coordinates: { lat: 32.6401, lng: -117.0842 } },
          { name: "Fremont", state: "California", country: "United States", coordinates: { lat: 37.5483, lng: -121.9886 } }
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
      },
      {
        name: "Illinois",
        country: "United States",
        cities: [
          { name: "Chicago", state: "Illinois", country: "United States", coordinates: { lat: 41.8781, lng: -87.6298 } },
          { name: "Aurora", state: "Illinois", country: "United States", coordinates: { lat: 41.7606, lng: -88.3201 } },
          { name: "Rockford", state: "Illinois", country: "United States", coordinates: { lat: 42.2711, lng: -89.0940 } },
          { name: "Joliet", state: "Illinois", country: "United States", coordinates: { lat: 41.5250, lng: -88.0817 } },
          { name: "Naperville", state: "Illinois", country: "United States", coordinates: { lat: 41.7508, lng: -88.1535 } }
        ]
      },
      {
        name: "Pennsylvania",
        country: "United States",
        cities: [
          { name: "Philadelphia", state: "Pennsylvania", country: "United States", coordinates: { lat: 39.9526, lng: -75.1652 } },
          { name: "Pittsburgh", state: "Pennsylvania", country: "United States", coordinates: { lat: 40.4406, lng: -79.9959 } },
          { name: "Allentown", state: "Pennsylvania", country: "United States", coordinates: { lat: 40.6084, lng: -75.4901 } },
          { name: "Erie", state: "Pennsylvania", country: "United States", coordinates: { lat: 42.1292, lng: -80.0851 } },
          { name: "Reading", state: "Pennsylvania", country: "United States", coordinates: { lat: 40.3357, lng: -75.9269 } }
        ]
      },
      {
        name: "Ohio",
        country: "United States",
        cities: [
          { name: "Columbus", state: "Ohio", country: "United States", coordinates: { lat: 39.9612, lng: -82.9988 } },
          { name: "Cleveland", state: "Ohio", country: "United States", coordinates: { lat: 41.4993, lng: -81.6944 } },
          { name: "Cincinnati", state: "Ohio", country: "United States", coordinates: { lat: 39.1031, lng: -84.5120 } },
          { name: "Toledo", state: "Ohio", country: "United States", coordinates: { lat: 41.6528, lng: -83.5379 } },
          { name: "Akron", state: "Ohio", country: "United States", coordinates: { lat: 41.0814, lng: -81.5190 } }
        ]
      },
      {
        name: "Georgia",
        country: "United States",
        cities: [
          { name: "Atlanta", state: "Georgia", country: "United States", coordinates: { lat: 33.7490, lng: -84.3880 } },
          { name: "Augusta", state: "Georgia", country: "United States", coordinates: { lat: 33.4735, lng: -82.0105 } },
          { name: "Columbus", state: "Georgia", country: "United States", coordinates: { lat: 32.4609, lng: -84.9877 } },
          { name: "Savannah", state: "Georgia", country: "United States", coordinates: { lat: 32.0835, lng: -81.0998 } },
          { name: "Athens", state: "Georgia", country: "United States", coordinates: { lat: 33.9519, lng: -83.3576 } }
        ]
      },
      {
        name: "North Carolina",
        country: "United States",
        cities: [
          { name: "Charlotte", state: "North Carolina", country: "United States", coordinates: { lat: 35.2271, lng: -80.8431 } },
          { name: "Raleigh", state: "North Carolina", country: "United States", coordinates: { lat: 35.7796, lng: -78.6382 } },
          { name: "Greensboro", state: "North Carolina", country: "United States", coordinates: { lat: 36.0726, lng: -79.7920 } },
          { name: "Durham", state: "North Carolina", country: "United States", coordinates: { lat: 35.9940, lng: -78.8986 } },
          { name: "Winston-Salem", state: "North Carolina", country: "United States", coordinates: { lat: 36.0999, lng: -80.2442 } }
        ]
      },
      {
        name: "Michigan",
        country: "United States",
        cities: [
          { name: "Detroit", state: "Michigan", country: "United States", coordinates: { lat: 42.3314, lng: -83.0458 } },
          { name: "Grand Rapids", state: "Michigan", country: "United States", coordinates: { lat: 42.9634, lng: -85.6681 } },
          { name: "Warren", state: "Michigan", country: "United States", coordinates: { lat: 42.5145, lng: -83.0147 } },
          { name: "Sterling Heights", state: "Michigan", country: "United States", coordinates: { lat: 42.5803, lng: -83.0302 } },
          { name: "Lansing", state: "Michigan", country: "United States", coordinates: { lat: 42.7325, lng: -84.5555 } }
        ]
      },
      {
        name: "New Jersey",
        country: "United States",
        cities: [
          { name: "Newark", state: "New Jersey", country: "United States", coordinates: { lat: 40.7357, lng: -74.1724 } },
          { name: "Jersey City", state: "New Jersey", country: "United States", coordinates: { lat: 40.7178, lng: -74.0431 } },
          { name: "Paterson", state: "New Jersey", country: "United States", coordinates: { lat: 40.9168, lng: -74.1718 } },
          { name: "Elizabeth", state: "New Jersey", country: "United States", coordinates: { lat: 40.6639, lng: -74.2107 } },
          { name: "Trenton", state: "New Jersey", country: "United States", coordinates: { lat: 40.2206, lng: -74.7597 } }
        ]
      },
      {
        name: "Virginia",
        country: "United States",
        cities: [
          { name: "Virginia Beach", state: "Virginia", country: "United States", coordinates: { lat: 36.8529, lng: -75.9780 } },
          { name: "Norfolk", state: "Virginia", country: "United States", coordinates: { lat: 36.8468, lng: -76.2852 } },
          { name: "Chesapeake", state: "Virginia", country: "United States", coordinates: { lat: 36.7682, lng: -76.2875 } },
          { name: "Richmond", state: "Virginia", country: "United States", coordinates: { lat: 37.5407, lng: -77.4360 } },
          { name: "Newport News", state: "Virginia", country: "United States", coordinates: { lat: 37.0871, lng: -76.4730 } }
        ]
      },
      {
        name: "Washington",
        country: "United States",
        cities: [
          { name: "Seattle", state: "Washington", country: "United States", coordinates: { lat: 47.6062, lng: -122.3321 } },
          { name: "Spokane", state: "Washington", country: "United States", coordinates: { lat: 47.6588, lng: -117.4260 } },
          { name: "Tacoma", state: "Washington", country: "United States", coordinates: { lat: 47.2529, lng: -122.4443 } },
          { name: "Vancouver", state: "Washington", country: "United States", coordinates: { lat: 45.6387, lng: -122.6615 } },
          { name: "Bellevue", state: "Washington", country: "United States", coordinates: { lat: 47.6101, lng: -122.2015 } }
        ]
      },
      {
        name: "Arizona",
        country: "United States",
        cities: [
          { name: "Phoenix", state: "Arizona", country: "United States", coordinates: { lat: 33.4484, lng: -112.0740 } },
          { name: "Tucson", state: "Arizona", country: "United States", coordinates: { lat: 32.2226, lng: -110.9747 } },
          { name: "Mesa", state: "Arizona", country: "United States", coordinates: { lat: 33.4152, lng: -111.8315 } },
          { name: "Chandler", state: "Arizona", country: "United States", coordinates: { lat: 33.3062, lng: -111.8412 } },
          { name: "Scottsdale", state: "Arizona", country: "United States", coordinates: { lat: 33.4942, lng: -111.9211 } }
        ]
      },
      {
        name: "Massachusetts",
        country: "United States",
        cities: [
          { name: "Boston", state: "Massachusetts", country: "United States", coordinates: { lat: 42.3601, lng: -71.0589 } },
          { name: "Worcester", state: "Massachusetts", country: "United States", coordinates: { lat: 42.2626, lng: -71.8023 } },
          { name: "Springfield", state: "Massachusetts", country: "United States", coordinates: { lat: 42.1015, lng: -72.5898 } },
          { name: "Cambridge", state: "Massachusetts", country: "United States", coordinates: { lat: 42.3736, lng: -71.1097 } },
          { name: "Lowell", state: "Massachusetts", country: "United States", coordinates: { lat: 42.6334, lng: -71.3162 } }
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
          { name: "Leicester", state: "England", country: "United Kingdom", coordinates: { lat: 52.6369, lng: -1.1398 } },
          { name: "Coventry", state: "England", country: "United Kingdom", coordinates: { lat: 52.4068, lng: -1.5197 } },
          { name: "Bradford", state: "England", country: "United Kingdom", coordinates: { lat: 53.7960, lng: -1.7594 } },
          { name: "Hull", state: "England", country: "United Kingdom", coordinates: { lat: 53.7676, lng: -0.3274 } },
          { name: "Plymouth", state: "England", country: "United Kingdom", coordinates: { lat: 50.3755, lng: -4.1427 } },
          { name: "Stoke-on-Trent", state: "England", country: "United Kingdom", coordinates: { lat: 53.0027, lng: -2.1794 } }
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
          { name: "Stirling", state: "Scotland", country: "United Kingdom", coordinates: { lat: 56.1165, lng: -3.9369 } },
          { name: "Perth", state: "Scotland", country: "United Kingdom", coordinates: { lat: 56.3959, lng: -3.4308 } },
          { name: "Inverness", state: "Scotland", country: "United Kingdom", coordinates: { lat: 57.4778, lng: -4.2247 } },
          { name: "Dumfries", state: "Scotland", country: "United Kingdom", coordinates: { lat: 55.0709, lng: -3.6033 } }
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
          { name: "Barry", state: "Wales", country: "United Kingdom", coordinates: { lat: 51.3994, lng: -3.2631 } },
          { name: "Caerphilly", state: "Wales", country: "United Kingdom", coordinates: { lat: 51.5742, lng: -3.2180 } },
          { name: "Rhondda", state: "Wales", country: "United Kingdom", coordinates: { lat: 51.6580, lng: -3.4480 } },
          { name: "Merthyr Tydfil", state: "Wales", country: "United Kingdom", coordinates: { lat: 51.7486, lng: -3.3773 } }
        ]
      },
      {
        name: "Northern Ireland",
        country: "United Kingdom",
        cities: [
          { name: "Belfast", state: "Northern Ireland", country: "United Kingdom", coordinates: { lat: 54.5973, lng: -5.9301 } },
          { name: "Derry", state: "Northern Ireland", country: "United Kingdom", coordinates: { lat: 54.9966, lng: -7.3086 } },
          { name: "Lisburn", state: "Northern Ireland", country: "United Kingdom", coordinates: { lat: 54.5139, lng: -6.0433 } },
          { name: "Newry", state: "Northern Ireland", country: "United Kingdom", coordinates: { lat: 54.1804, lng: -6.3382 } },
          { name: "Armagh", state: "Northern Ireland", country: "United Kingdom", coordinates: { lat: 54.3503, lng: -6.6528 } }
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
      },
      {
        name: "Alberta",
        country: "Canada",
        cities: [
          { name: "Calgary", state: "Alberta", country: "Canada", coordinates: { lat: 51.0447, lng: -114.0719 } },
          { name: "Edmonton", state: "Alberta", country: "Canada", coordinates: { lat: 53.5461, lng: -113.4938 } },
          { name: "Red Deer", state: "Alberta", country: "Canada", coordinates: { lat: 52.2681, lng: -113.8112 } },
          { name: "Lethbridge", state: "Alberta", country: "Canada", coordinates: { lat: 49.6939, lng: -112.8416 } },
          { name: "St. Albert", state: "Alberta", country: "Canada", coordinates: { lat: 53.6333, lng: -113.6333 } }
        ]
      },
      {
        name: "Manitoba",
        country: "Canada",
        cities: [
          { name: "Winnipeg", state: "Manitoba", country: "Canada", coordinates: { lat: 49.8951, lng: -97.1384 } },
          { name: "Brandon", state: "Manitoba", country: "Canada", coordinates: { lat: 49.8483, lng: -99.9500 } },
          { name: "Steinbach", state: "Manitoba", country: "Canada", coordinates: { lat: 49.5258, lng: -96.6845 } },
          { name: "Thompson", state: "Manitoba", country: "Canada", coordinates: { lat: 55.7431, lng: -97.8558 } },
          { name: "Portage la Prairie", state: "Manitoba", country: "Canada", coordinates: { lat: 49.9728, lng: -98.2919 } }
        ]
      },
      {
        name: "Saskatchewan",
        country: "Canada",
        cities: [
          { name: "Saskatoon", state: "Saskatchewan", country: "Canada", coordinates: { lat: 52.1579, lng: -106.6702 } },
          { name: "Regina", state: "Saskatchewan", country: "Canada", coordinates: { lat: 50.4452, lng: -104.6189 } },
          { name: "Prince Albert", state: "Saskatchewan", country: "Canada", coordinates: { lat: 53.2033, lng: -105.7531 } },
          { name: "Moose Jaw", state: "Saskatchewan", country: "Canada", coordinates: { lat: 50.3934, lng: -105.5509 } },
          { name: "Swift Current", state: "Saskatchewan", country: "Canada", coordinates: { lat: 50.2881, lng: -107.8019 } }
        ]
      },
      {
        name: "Nova Scotia",
        country: "Canada",
        cities: [
          { name: "Halifax", state: "Nova Scotia", country: "Canada", coordinates: { lat: 44.6488, lng: -63.5752 } },
          { name: "Sydney", state: "Nova Scotia", country: "Canada", coordinates: { lat: 46.1368, lng: -60.1942 } },
          { name: "Dartmouth", state: "Nova Scotia", country: "Canada", coordinates: { lat: 44.6709, lng: -63.5773 } },
          { name: "Truro", state: "Nova Scotia", country: "Canada", coordinates: { lat: 45.3651, lng: -63.2794 } },
          { name: "New Glasgow", state: "Nova Scotia", country: "Canada", coordinates: { lat: 45.5928, lng: -62.6486 } }
        ]
      },
      {
        name: "New Brunswick",
        country: "Canada",
        cities: [
          { name: "Moncton", state: "New Brunswick", country: "Canada", coordinates: { lat: 46.0878, lng: -64.7782 } },
          { name: "Saint John", state: "New Brunswick", country: "Canada", coordinates: { lat: 45.2733, lng: -66.0633 } },
          { name: "Fredericton", state: "New Brunswick", country: "Canada", coordinates: { lat: 45.9636, lng: -66.6431 } },
          { name: "Dieppe", state: "New Brunswick", country: "Canada", coordinates: { lat: 46.0789, lng: -64.6875 } },
          { name: "Riverview", state: "New Brunswick", country: "Canada", coordinates: { lat: 46.0619, lng: -64.8056 } }
        ]
      },
      {
        name: "Newfoundland and Labrador",
        country: "Canada",
        cities: [
          { name: "St. John's", state: "Newfoundland and Labrador", country: "Canada", coordinates: { lat: 47.5615, lng: -52.7126 } },
          { name: "Mount Pearl", state: "Newfoundland and Labrador", country: "Canada", coordinates: { lat: 47.5167, lng: -52.8000 } },
          { name: "Conception Bay South", state: "Newfoundland and Labrador", country: "Canada", coordinates: { lat: 47.5167, lng: -52.9833 } },
          { name: "Corner Brook", state: "Newfoundland and Labrador", country: "Canada", coordinates: { lat: 48.9500, lng: -57.9500 } },
          { name: "Grand Falls-Windsor", state: "Newfoundland and Labrador", country: "Canada", coordinates: { lat: 48.9500, lng: -55.6500 } }
        ]
      },
      {
        name: "Prince Edward Island",
        country: "Canada",
        cities: [
          { name: "Charlottetown", state: "Prince Edward Island", country: "Canada", coordinates: { lat: 46.2382, lng: -63.1311 } },
          { name: "Summerside", state: "Prince Edward Island", country: "Canada", coordinates: { lat: 46.3950, lng: -63.7878 } },
          { name: "Stratford", state: "Prince Edward Island", country: "Canada", coordinates: { lat: 46.2167, lng: -63.0833 } },
          { name: "Cornwall", state: "Prince Edward Island", country: "Canada", coordinates: { lat: 46.2333, lng: -63.2167 } },
          { name: "Montague", state: "Prince Edward Island", country: "Canada", coordinates: { lat: 46.1667, lng: -62.6500 } }
        ]
      },
      {
        name: "Northwest Territories",
        country: "Canada",
        cities: [
          { name: "Yellowknife", state: "Northwest Territories", country: "Canada", coordinates: { lat: 62.4540, lng: -114.3718 } },
          { name: "Hay River", state: "Northwest Territories", country: "Canada", coordinates: { lat: 60.8156, lng: -115.7999 } },
          { name: "Inuvik", state: "Northwest Territories", country: "Canada", coordinates: { lat: 68.3607, lng: -133.7230 } },
          { name: "Fort Smith", state: "Northwest Territories", country: "Canada", coordinates: { lat: 60.0042, lng: -111.8936 } },
          { name: "Behchokò", state: "Northwest Territories", country: "Canada", coordinates: { lat: 62.8000, lng: -116.0167 } }
        ]
      },
      {
        name: "Nunavut",
        country: "Canada",
        cities: [
          { name: "Iqaluit", state: "Nunavut", country: "Canada", coordinates: { lat: 63.7467, lng: -68.5170 } },
          { name: "Rankin Inlet", state: "Nunavut", country: "Canada", coordinates: { lat: 62.8081, lng: -92.0853 } },
          { name: "Arviat", state: "Nunavut", country: "Canada", coordinates: { lat: 61.1086, lng: -94.0586 } },
          { name: "Baker Lake", state: "Nunavut", country: "Canada", coordinates: { lat: 64.3189, lng: -96.0278 } },
          { name: "Cambridge Bay", state: "Nunavut", country: "Canada", coordinates: { lat: 69.1169, lng: -105.0597 } }
        ]
      },
      {
        name: "Yukon",
        country: "Canada",
        cities: [
          { name: "Whitehorse", state: "Yukon", country: "Canada", coordinates: { lat: 60.7212, lng: -135.0568 } },
          { name: "Dawson City", state: "Yukon", country: "Canada", coordinates: { lat: 64.0601, lng: -139.4331 } },
          { name: "Watson Lake", state: "Yukon", country: "Canada", coordinates: { lat: 60.0633, lng: -128.7089 } },
          { name: "Haines Junction", state: "Yukon", country: "Canada", coordinates: { lat: 60.7522, lng: -137.5108 } },
          { name: "Carmacks", state: "Yukon", country: "Canada", coordinates: { lat: 62.0889, lng: -136.3056 } }
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
      },
      {
        name: "Lower Saxony",
        country: "Germany",
        cities: [
          { name: "Hannover", state: "Lower Saxony", country: "Germany", coordinates: { lat: 52.3759, lng: 9.7320 } },
          { name: "Braunschweig", state: "Lower Saxony", country: "Germany", coordinates: { lat: 52.2689, lng: 10.5268 } },
          { name: "Osnabrück", state: "Lower Saxony", country: "Germany", coordinates: { lat: 52.2799, lng: 8.0472 } },
          { name: "Oldenburg", state: "Lower Saxony", country: "Germany", coordinates: { lat: 53.1434, lng: 8.2146 } },
          { name: "Göttingen", state: "Lower Saxony", country: "Germany", coordinates: { lat: 51.5413, lng: 9.9158 } }
        ]
      },
      {
        name: "Hesse",
        country: "Germany",
        cities: [
          { name: "Frankfurt", state: "Hesse", country: "Germany", coordinates: { lat: 50.1109, lng: 8.6821 } },
          { name: "Wiesbaden", state: "Hesse", country: "Germany", coordinates: { lat: 50.0826, lng: 8.2493 } },
          { name: "Kassel", state: "Hesse", country: "Germany", coordinates: { lat: 51.3127, lng: 9.4797 } },
          { name: "Darmstadt", state: "Hesse", country: "Germany", coordinates: { lat: 49.8728, lng: 8.6512 } },
          { name: "Offenbach", state: "Hesse", country: "Germany", coordinates: { lat: 50.0956, lng: 8.7761 } }
        ]
      },
      {
        name: "Saxony",
        country: "Germany",
        cities: [
          { name: "Dresden", state: "Saxony", country: "Germany", coordinates: { lat: 51.0504, lng: 13.7373 } },
          { name: "Leipzig", state: "Saxony", country: "Germany", coordinates: { lat: 51.3397, lng: 12.3731 } },
          { name: "Chemnitz", state: "Saxony", country: "Germany", coordinates: { lat: 50.8278, lng: 12.9214 } },
          { name: "Zwickau", state: "Saxony", country: "Germany", coordinates: { lat: 50.7186, lng: 12.4961 } },
          { name: "Plauen", state: "Saxony", country: "Germany", coordinates: { lat: 50.4964, lng: 12.1378 } }
        ]
      },
      {
        name: "Rhineland-Palatinate",
        country: "Germany",
        cities: [
          { name: "Mainz", state: "Rhineland-Palatinate", country: "Germany", coordinates: { lat: 49.9929, lng: 8.2473 } },
          { name: "Ludwigshafen", state: "Rhineland-Palatinate", country: "Germany", coordinates: { lat: 49.4812, lng: 8.4464 } },
          { name: "Koblenz", state: "Rhineland-Palatinate", country: "Germany", coordinates: { lat: 50.3569, lng: 7.5890 } },
          { name: "Trier", state: "Rhineland-Palatinate", country: "Germany", coordinates: { lat: 49.7596, lng: 6.6439 } },
          { name: "Kaiserslautern", state: "Rhineland-Palatinate", country: "Germany", coordinates: { lat: 49.4432, lng: 7.7711 } }
        ]
      },
      {
        name: "Berlin",
        country: "Germany",
        cities: [
          { name: "Berlin", state: "Berlin", country: "Germany", coordinates: { lat: 52.5200, lng: 13.4050 } },
          { name: "Charlottenburg", state: "Berlin", country: "Germany", coordinates: { lat: 52.5048, lng: 13.3045 } },
          { name: "Kreuzberg", state: "Berlin", country: "Germany", coordinates: { lat: 52.4990, lng: 13.4034 } },
          { name: "Prenzlauer Berg", state: "Berlin", country: "Germany", coordinates: { lat: 52.5388, lng: 13.4244 } },
          { name: "Friedrichshain", state: "Berlin", country: "Germany", coordinates: { lat: 52.5158, lng: 13.4543 } }
        ]
      },
      {
        name: "Hamburg",
        country: "Germany",
        cities: [
          { name: "Hamburg", state: "Hamburg", country: "Germany", coordinates: { lat: 53.5511, lng: 9.9937 } },
          { name: "Altona", state: "Hamburg", country: "Germany", coordinates: { lat: 53.5500, lng: 9.9333 } },
          { name: "Harburg", state: "Hamburg", country: "Germany", coordinates: { lat: 53.4600, lng: 9.9800 } },
          { name: "Wandsbek", state: "Hamburg", country: "Germany", coordinates: { lat: 53.5833, lng: 10.0833 } },
          { name: "Bergedorf", state: "Hamburg", country: "Germany", coordinates: { lat: 53.4833, lng: 10.2167 } }
        ]
      },
      {
        name: "Bremen",
        country: "Germany",
        cities: [
          { name: "Bremen", state: "Bremen", country: "Germany", coordinates: { lat: 53.0793, lng: 8.8017 } },
          { name: "Bremerhaven", state: "Bremen", country: "Germany", coordinates: { lat: 53.5396, lng: 8.5809 } }
        ]
      },
      {
        name: "Schleswig-Holstein",
        country: "Germany",
        cities: [
          { name: "Kiel", state: "Schleswig-Holstein", country: "Germany", coordinates: { lat: 54.3233, lng: 10.1228 } },
          { name: "Lübeck", state: "Schleswig-Holstein", country: "Germany", coordinates: { lat: 53.8655, lng: 10.6866 } },
          { name: "Flensburg", state: "Schleswig-Holstein", country: "Germany", coordinates: { lat: 54.7818, lng: 9.4368 } },
          { name: "Neumünster", state: "Schleswig-Holstein", country: "Germany", coordinates: { lat: 54.0717, lng: 9.9817 } },
          { name: "Norderstedt", state: "Schleswig-Holstein", country: "Germany", coordinates: { lat: 53.7000, lng: 9.9833 } }
        ]
      },
      {
        name: "Brandenburg",
        country: "Germany",
        cities: [
          { name: "Potsdam", state: "Brandenburg", country: "Germany", coordinates: { lat: 52.4009, lng: 13.0592 } },
          { name: "Cottbus", state: "Brandenburg", country: "Germany", coordinates: { lat: 51.7606, lng: 14.3342 } },
          { name: "Brandenburg an der Havel", state: "Brandenburg", country: "Germany", coordinates: { lat: 52.4125, lng: 12.5316 } },
          { name: "Frankfurt (Oder)", state: "Brandenburg", country: "Germany", coordinates: { lat: 52.3471, lng: 14.5506 } },
          { name: "Eberswalde", state: "Brandenburg", country: "Germany", coordinates: { lat: 52.8333, lng: 13.8167 } }
        ]
      },
      {
        name: "Mecklenburg-Vorpommern",
        country: "Germany",
        cities: [
          { name: "Rostock", state: "Mecklenburg-Vorpommern", country: "Germany", coordinates: { lat: 54.0924, lng: 12.0991 } },
          { name: "Schwerin", state: "Mecklenburg-Vorpommern", country: "Germany", coordinates: { lat: 53.6355, lng: 11.4012 } },
          { name: "Neubrandenburg", state: "Mecklenburg-Vorpommern", country: "Germany", coordinates: { lat: 53.5573, lng: 13.2610 } },
          { name: "Stralsund", state: "Mecklenburg-Vorpommern", country: "Germany", coordinates: { lat: 54.3089, lng: 13.0819 } },
          { name: "Greifswald", state: "Mecklenburg-Vorpommern", country: "Germany", coordinates: { lat: 54.0969, lng: 13.3876 } }
        ]
      },
      {
        name: "Saxony-Anhalt",
        country: "Germany",
        cities: [
          { name: "Magdeburg", state: "Saxony-Anhalt", country: "Germany", coordinates: { lat: 52.1205, lng: 11.6276 } },
          { name: "Halle", state: "Saxony-Anhalt", country: "Germany", coordinates: { lat: 51.4962, lng: 11.9688 } },
          { name: "Dessau-Roßlau", state: "Saxony-Anhalt", country: "Germany", coordinates: { lat: 51.8400, lng: 12.2500 } },
          { name: "Wittenberg", state: "Saxony-Anhalt", country: "Germany", coordinates: { lat: 51.8667, lng: 12.6333 } },
          { name: "Stendal", state: "Saxony-Anhalt", country: "Germany", coordinates: { lat: 52.6000, lng: 11.8500 } }
        ]
      },
      {
        name: "Thuringia",
        country: "Germany",
        cities: [
          { name: "Erfurt", state: "Thuringia", country: "Germany", coordinates: { lat: 50.9848, lng: 11.0299 } },
          { name: "Jena", state: "Thuringia", country: "Germany", coordinates: { lat: 50.9279, lng: 11.5862 } },
          { name: "Gera", state: "Thuringia", country: "Germany", coordinates: { lat: 50.8808, lng: 12.0819 } },
          { name: "Weimar", state: "Thuringia", country: "Germany", coordinates: { lat: 50.9795, lng: 11.3235 } },
          { name: "Gotha", state: "Thuringia", country: "Germany", coordinates: { lat: 50.9482, lng: 10.7019 } }
        ]
      },
      {
        name: "Saarland",
        country: "Germany",
        cities: [
          { name: "Saarbrücken", state: "Saarland", country: "Germany", coordinates: { lat: 49.2402, lng: 6.9969 } },
          { name: "Neunkirchen", state: "Saarland", country: "Germany", coordinates: { lat: 49.3444, lng: 7.1806 } },
          { name: "Homburg", state: "Saarland", country: "Germany", coordinates: { lat: 49.3167, lng: 7.3333 } },
          { name: "Völklingen", state: "Saarland", country: "Germany", coordinates: { lat: 49.2500, lng: 6.8500 } },
          { name: "Sankt Ingbert", state: "Saarland", country: "Germany", coordinates: { lat: 49.3000, lng: 7.1167 } }
        ]
      }
    ]
  },
  {
    name: "France",
    code: "FR",
    states: [
      {
        name: "Île-de-France",
        country: "France",
        cities: [
          { name: "Paris", state: "Île-de-France", country: "France", coordinates: { lat: 48.8566, lng: 2.3522 } },
          { name: "Boulogne-Billancourt", state: "Île-de-France", country: "France", coordinates: { lat: 48.8333, lng: 2.2500 } },
          { name: "Saint-Denis", state: "Île-de-France", country: "France", coordinates: { lat: 48.9364, lng: 2.3574 } },
          { name: "Argenteuil", state: "Île-de-France", country: "France", coordinates: { lat: 48.9500, lng: 2.2500 } },
          { name: "Montreuil", state: "Île-de-France", country: "France", coordinates: { lat: 48.8667, lng: 2.4500 } }
        ]
      },
      {
        name: "Provence-Alpes-Côte d'Azur",
        country: "France",
        cities: [
          { name: "Marseille", state: "Provence-Alpes-Côte d'Azur", country: "France", coordinates: { lat: 43.2965, lng: 5.3698 } },
          { name: "Nice", state: "Provence-Alpes-Côte d'Azur", country: "France", coordinates: { lat: 43.7102, lng: 7.2620 } },
          { name: "Toulon", state: "Provence-Alpes-Côte d'Azur", country: "France", coordinates: { lat: 43.1242, lng: 5.9280 } },
          { name: "Aix-en-Provence", state: "Provence-Alpes-Côte d'Azur", country: "France", coordinates: { lat: 43.5263, lng: 5.4454 } },
          { name: "Avignon", state: "Provence-Alpes-Côte d'Azur", country: "France", coordinates: { lat: 43.9493, lng: 4.8055 } }
        ]
      },
      {
        name: "Auvergne-Rhône-Alpes",
        country: "France",
        cities: [
          { name: "Lyon", state: "Auvergne-Rhône-Alpes", country: "France", coordinates: { lat: 45.7640, lng: 4.8357 } },
          { name: "Saint-Étienne", state: "Auvergne-Rhône-Alpes", country: "France", coordinates: { lat: 45.4397, lng: 4.3872 } },
          { name: "Grenoble", state: "Auvergne-Rhône-Alpes", country: "France", coordinates: { lat: 45.1885, lng: 5.7245 } },
          { name: "Villeurbanne", state: "Auvergne-Rhône-Alpes", country: "France", coordinates: { lat: 45.7667, lng: 4.8833 } },
          { name: "Clermont-Ferrand", state: "Auvergne-Rhône-Alpes", country: "France", coordinates: { lat: 45.7772, lng: 3.0870 } }
        ]
      },
      {
        name: "Hauts-de-France",
        country: "France",
        cities: [
          { name: "Lille", state: "Hauts-de-France", country: "France", coordinates: { lat: 50.6292, lng: 3.0573 } },
          { name: "Amiens", state: "Hauts-de-France", country: "France", coordinates: { lat: 49.8943, lng: 2.2958 } },
          { name: "Roubaix", state: "Hauts-de-France", country: "France", coordinates: { lat: 50.6927, lng: 3.1762 } },
          { name: "Tourcoing", state: "Hauts-de-France", country: "France", coordinates: { lat: 50.7239, lng: 3.1612 } },
          { name: "Dunkerque", state: "Hauts-de-France", country: "France", coordinates: { lat: 51.0344, lng: 2.3768 } }
        ]
      },
      {
        name: "Grand Est",
        country: "France",
        cities: [
          { name: "Strasbourg", state: "Grand Est", country: "France", coordinates: { lat: 48.5734, lng: 7.7521 } },
          { name: "Reims", state: "Grand Est", country: "France", coordinates: { lat: 49.2583, lng: 4.0317 } },
          { name: "Metz", state: "Grand Est", country: "France", coordinates: { lat: 49.1193, lng: 6.1757 } },
          { name: "Mulhouse", state: "Grand Est", country: "France", coordinates: { lat: 47.7508, lng: 7.3356 } },
          { name: "Nancy", state: "Grand Est", country: "France", coordinates: { lat: 48.6921, lng: 6.1844 } }
        ]
      },
      {
        name: "Brittany",
        country: "France",
        cities: [
          { name: "Rennes", state: "Brittany", country: "France", coordinates: { lat: 48.1173, lng: -1.6778 } },
          { name: "Brest", state: "Brittany", country: "France", coordinates: { lat: 48.3905, lng: -4.4860 } },
          { name: "Quimper", state: "Brittany", country: "France", coordinates: { lat: 47.9961, lng: -4.0969 } },
          { name: "Lorient", state: "Brittany", country: "France", coordinates: { lat: 47.7500, lng: -3.3667 } },
          { name: "Vannes", state: "Brittany", country: "France", coordinates: { lat: 47.6582, lng: -2.7608 } }
        ]
      },
      {
        name: "Normandy",
        country: "France",
        cities: [
          { name: "Rouen", state: "Normandy", country: "France", coordinates: { lat: 49.4432, lng: 1.0993 } },
          { name: "Le Havre", state: "Normandy", country: "France", coordinates: { lat: 49.4944, lng: 0.1079 } },
          { name: "Caen", state: "Normandy", country: "France", coordinates: { lat: 49.1829, lng: -0.3707 } },
          { name: "Cherbourg", state: "Normandy", country: "France", coordinates: { lat: 49.6333, lng: -1.6167 } },
          { name: "Évreux", state: "Normandy", country: "France", coordinates: { lat: 49.0247, lng: 1.1508 } }
        ]
      },
      {
        name: "Nouvelle-Aquitaine",
        country: "France",
        cities: [
          { name: "Bordeaux", state: "Nouvelle-Aquitaine", country: "France", coordinates: { lat: 44.8378, lng: -0.5792 } },
          { name: "Limoges", state: "Nouvelle-Aquitaine", country: "France", coordinates: { lat: 45.8336, lng: 1.2611 } },
          { name: "Poitiers", state: "Nouvelle-Aquitaine", country: "France", coordinates: { lat: 46.5802, lng: 0.3404 } },
          { name: "La Rochelle", state: "Nouvelle-Aquitaine", country: "France", coordinates: { lat: 46.1603, lng: -1.1511 } },
          { name: "Pau", state: "Nouvelle-Aquitaine", country: "France", coordinates: { lat: 43.2951, lng: -0.3707 } }
        ]
      },
      {
        name: "Occitanie",
        country: "France",
        cities: [
          { name: "Toulouse", state: "Occitanie", country: "France", coordinates: { lat: 43.6047, lng: 1.4442 } },
          { name: "Montpellier", state: "Occitanie", country: "France", coordinates: { lat: 43.6110, lng: 3.8767 } },
          { name: "Nîmes", state: "Occitanie", country: "France", coordinates: { lat: 43.8367, lng: 4.3601 } },
          { name: "Perpignan", state: "Occitanie", country: "France", coordinates: { lat: 42.6886, lng: 2.8948 } },
          { name: "Béziers", state: "Occitanie", country: "France", coordinates: { lat: 43.3472, lng: 3.2150 } }
        ]
      },
      {
        name: "Centre-Val de Loire",
        country: "France",
        cities: [
          { name: "Tours", state: "Centre-Val de Loire", country: "France", coordinates: { lat: 47.3941, lng: 0.6848 } },
          { name: "Orléans", state: "Centre-Val de Loire", country: "France", coordinates: { lat: 47.9029, lng: 1.9093 } },
          { name: "Blois", state: "Centre-Val de Loire", country: "France", coordinates: { lat: 47.5861, lng: 1.3359 } },
          { name: "Bourges", state: "Centre-Val de Loire", country: "France", coordinates: { lat: 47.0810, lng: 2.3988 } },
          { name: "Châteauroux", state: "Centre-Val de Loire", country: "France", coordinates: { lat: 46.8117, lng: 1.6906 } }
        ]
      },
      {
        name: "Bourgogne-Franche-Comté",
        country: "France",
        cities: [
          { name: "Dijon", state: "Bourgogne-Franche-Comté", country: "France", coordinates: { lat: 47.3220, lng: 5.0415 } },
          { name: "Besançon", state: "Bourgogne-Franche-Comté", country: "France", coordinates: { lat: 47.2380, lng: 6.0223 } },
          { name: "Belfort", state: "Bourgogne-Franche-Comté", country: "France", coordinates: { lat: 47.6379, lng: 6.8629 } },
          { name: "Chalon-sur-Saône", state: "Bourgogne-Franche-Comté", country: "France", coordinates: { lat: 46.7806, lng: 4.8531 } },
          { name: "Auxerre", state: "Bourgogne-Franche-Comté", country: "France", coordinates: { lat: 47.7974, lng: 3.5700 } }
        ]
      },
      {
        name: "Pays de la Loire",
        country: "France",
        cities: [
          { name: "Nantes", state: "Pays de la Loire", country: "France", coordinates: { lat: 47.2184, lng: -1.5536 } },
          { name: "Angers", state: "Pays de la Loire", country: "France", coordinates: { lat: 47.4784, lng: -0.5632 } },
          { name: "Le Mans", state: "Pays de la Loire", country: "France", coordinates: { lat: 48.0061, lng: 0.1996 } },
          { name: "Saint-Nazaire", state: "Pays de la Loire", country: "France", coordinates: { lat: 47.2730, lng: -2.2139 } },
          { name: "Cholet", state: "Pays de la Loire", country: "France", coordinates: { lat: 47.0594, lng: -0.8785 } }
        ]
      },
      {
        name: "Corsica",
        country: "France",
        cities: [
          { name: "Ajaccio", state: "Corsica", country: "France", coordinates: { lat: 41.9267, lng: 8.7369 } },
          { name: "Bastia", state: "Corsica", country: "France", coordinates: { lat: 42.7011, lng: 9.4500 } },
          { name: "Porto-Vecchio", state: "Corsica", country: "France", coordinates: { lat: 41.5906, lng: 9.2792 } },
          { name: "Corte", state: "Corsica", country: "France", coordinates: { lat: 42.3061, lng: 9.1500 } },
          { name: "Calvi", state: "Corsica", country: "France", coordinates: { lat: 42.5667, lng: 8.7500 } }
        ]
      }
    ]
  },
  {
    name: "Australia",
    code: "AU",
    states: [
      {
        name: "New South Wales",
        country: "Australia",
        cities: [
          { name: "Sydney", state: "New South Wales", country: "Australia", coordinates: { lat: -33.8688, lng: 151.2093 } },
          { name: "Newcastle", state: "New South Wales", country: "Australia", coordinates: { lat: -32.9267, lng: 151.7789 } },
          { name: "Wollongong", state: "New South Wales", country: "Australia", coordinates: { lat: -34.4278, lng: 150.8931 } },
          { name: "Wagga Wagga", state: "New South Wales", country: "Australia", coordinates: { lat: -35.1082, lng: 147.3598 } },
          { name: "Albury", state: "New South Wales", country: "Australia", coordinates: { lat: -36.0737, lng: 146.9135 } }
        ]
      },
      {
        name: "Victoria",
        country: "Australia",
        cities: [
          { name: "Melbourne", state: "Victoria", country: "Australia", coordinates: { lat: -37.8136, lng: 144.9631 } },
          { name: "Geelong", state: "Victoria", country: "Australia", coordinates: { lat: -38.1499, lng: 144.3617 } },
          { name: "Ballarat", state: "Victoria", country: "Australia", coordinates: { lat: -37.5622, lng: 143.8503 } },
          { name: "Bendigo", state: "Victoria", country: "Australia", coordinates: { lat: -36.7570, lng: 144.2792 } },
          { name: "Shepparton", state: "Victoria", country: "Australia", coordinates: { lat: -36.3773, lng: 145.3985 } }
        ]
      },
      {
        name: "Queensland",
        country: "Australia",
        cities: [
          { name: "Brisbane", state: "Queensland", country: "Australia", coordinates: { lat: -27.4698, lng: 153.0251 } },
          { name: "Gold Coast", state: "Queensland", country: "Australia", coordinates: { lat: -28.0167, lng: 153.4000 } },
          { name: "Townsville", state: "Queensland", country: "Australia", coordinates: { lat: -19.2590, lng: 146.8169 } },
          { name: "Cairns", state: "Queensland", country: "Australia", coordinates: { lat: -16.9186, lng: 145.7781 } },
          { name: "Toowoomba", state: "Queensland", country: "Australia", coordinates: { lat: -27.5598, lng: 151.9507 } }
        ]
      },
      {
        name: "Western Australia",
        country: "Australia",
        cities: [
          { name: "Perth", state: "Western Australia", country: "Australia", coordinates: { lat: -31.9505, lng: 115.8605 } },
          { name: "Fremantle", state: "Western Australia", country: "Australia", coordinates: { lat: -32.0567, lng: 115.7478 } },
          { name: "Rockingham", state: "Western Australia", country: "Australia", coordinates: { lat: -32.2833, lng: 115.7167 } },
          { name: "Mandurah", state: "Western Australia", country: "Australia", coordinates: { lat: -32.5333, lng: 115.7333 } },
          { name: "Bunbury", state: "Western Australia", country: "Australia", coordinates: { lat: -33.3333, lng: 115.6333 } }
        ]
      },
      {
        name: "South Australia",
        country: "Australia",
        cities: [
          { name: "Adelaide", state: "South Australia", country: "Australia", coordinates: { lat: -34.9285, lng: 138.6007 } },
          { name: "Mount Gambier", state: "South Australia", country: "Australia", coordinates: { lat: -37.8333, lng: 140.7667 } },
          { name: "Whyalla", state: "South Australia", country: "Australia", coordinates: { lat: -33.0333, lng: 137.5833 } },
          { name: "Murray Bridge", state: "South Australia", country: "Australia", coordinates: { lat: -35.1167, lng: 139.2667 } },
          { name: "Port Augusta", state: "South Australia", country: "Australia", coordinates: { lat: -32.4833, lng: 137.7500 } }
        ]
      },
      {
        name: "Tasmania",
        country: "Australia",
        cities: [
          { name: "Hobart", state: "Tasmania", country: "Australia", coordinates: { lat: -42.8821, lng: 147.3272 } },
          { name: "Launceston", state: "Tasmania", country: "Australia", coordinates: { lat: -41.4333, lng: 147.1333 } },
          { name: "Devonport", state: "Tasmania", country: "Australia", coordinates: { lat: -41.1833, lng: 146.3500 } },
          { name: "Burnie", state: "Tasmania", country: "Australia", coordinates: { lat: -41.0667, lng: 145.9167 } },
          { name: "Ulverstone", state: "Tasmania", country: "Australia", coordinates: { lat: -41.1500, lng: 146.1667 } }
        ]
      },
      {
        name: "Australian Capital Territory",
        country: "Australia",
        cities: [
          { name: "Canberra", state: "Australian Capital Territory", country: "Australia", coordinates: { lat: -35.2809, lng: 149.1300 } },
          { name: "Gungahlin", state: "Australian Capital Territory", country: "Australia", coordinates: { lat: -35.1833, lng: 149.1333 } },
          { name: "Tuggeranong", state: "Australian Capital Territory", country: "Australia", coordinates: { lat: -35.4167, lng: 149.0833 } },
          { name: "Belconnen", state: "Australian Capital Territory", country: "Australia", coordinates: { lat: -35.2333, lng: 149.0833 } },
          { name: "Weston Creek", state: "Australian Capital Territory", country: "Australia", coordinates: { lat: -35.3167, lng: 149.0500 } }
        ]
      },
      {
        name: "Northern Territory",
        country: "Australia",
        cities: [
          { name: "Darwin", state: "Northern Territory", country: "Australia", coordinates: { lat: -12.4634, lng: 130.8456 } },
          { name: "Alice Springs", state: "Northern Territory", country: "Australia", coordinates: { lat: -23.7000, lng: 133.8667 } },
          { name: "Katherine", state: "Northern Territory", country: "Australia", coordinates: { lat: -14.4667, lng: 132.2667 } },
          { name: "Palmerston", state: "Northern Territory", country: "Australia", coordinates: { lat: -12.4833, lng: 130.9833 } },
          { name: "Nhulunbuy", state: "Northern Territory", country: "Australia", coordinates: { lat: -12.1833, lng: 136.7833 } }
        ]
      }
    ]
  },
  {
    name: "Japan",
    code: "JP",
    states: [
      {
        name: "Tokyo",
        country: "Japan",
        cities: [
          { name: "Tokyo", state: "Tokyo", country: "Japan", coordinates: { lat: 35.6762, lng: 139.6503 } },
          { name: "Shibuya", state: "Tokyo", country: "Japan", coordinates: { lat: 35.6580, lng: 139.7016 } },
          { name: "Shinjuku", state: "Tokyo", country: "Japan", coordinates: { lat: 35.6896, lng: 139.6917 } },
          { name: "Ginza", state: "Tokyo", country: "Japan", coordinates: { lat: 35.6719, lng: 139.7653 } },
          { name: "Harajuku", state: "Tokyo", country: "Japan", coordinates: { lat: 35.6702, lng: 139.7026 } }
        ]
      },
      {
        name: "Osaka",
        country: "Japan",
        cities: [
          { name: "Osaka", state: "Osaka", country: "Japan", coordinates: { lat: 34.6937, lng: 135.5023 } },
          { name: "Sakai", state: "Osaka", country: "Japan", coordinates: { lat: 34.5734, lng: 135.4830 } },
          { name: "Higashiosaka", state: "Osaka", country: "Japan", coordinates: { lat: 34.6293, lng: 135.6006 } },
          { name: "Toyonaka", state: "Osaka", country: "Japan", coordinates: { lat: 34.7814, lng: 135.4692 } },
          { name: "Suita", state: "Osaka", country: "Japan", coordinates: { lat: 34.7614, lng: 135.5156 } }
        ]
      }
    ]
  },
  {
    name: "Brazil",
    code: "BR",
    states: [
      {
        name: "São Paulo",
        country: "Brazil",
        cities: [
          { name: "São Paulo", state: "São Paulo", country: "Brazil", coordinates: { lat: -23.5505, lng: -46.6333 } },
          { name: "Guarulhos", state: "São Paulo", country: "Brazil", coordinates: { lat: -23.4538, lng: -46.5331 } },
          { name: "Campinas", state: "São Paulo", country: "Brazil", coordinates: { lat: -22.9056, lng: -47.0608 } },
          { name: "São Bernardo do Campo", state: "São Paulo", country: "Brazil", coordinates: { lat: -23.6939, lng: -46.5650 } },
          { name: "Santo André", state: "São Paulo", country: "Brazil", coordinates: { lat: -23.6639, lng: -46.5383 } }
        ]
      },
      {
        name: "Rio de Janeiro",
        country: "Brazil",
        cities: [
          { name: "Rio de Janeiro", state: "Rio de Janeiro", country: "Brazil", coordinates: { lat: -22.9068, lng: -43.1729 } },
          { name: "Nova Iguaçu", state: "Rio de Janeiro", country: "Brazil", coordinates: { lat: -22.7592, lng: -43.4511 } },
          { name: "Niterói", state: "Rio de Janeiro", country: "Brazil", coordinates: { lat: -22.8833, lng: -43.1036 } },
          { name: "Campos dos Goytacazes", state: "Rio de Janeiro", country: "Brazil", coordinates: { lat: -21.7522, lng: -41.3308 } },
          { name: "Duque de Caxias", state: "Rio de Janeiro", country: "Brazil", coordinates: { lat: -22.7856, lng: -43.3047 } }
        ]
      }
    ]
  },
  {
    name: "India",
    code: "IN",
    states: [
      {
        name: "Maharashtra",
        country: "India",
        cities: [
          { name: "Mumbai", state: "Maharashtra", country: "India", coordinates: { lat: 19.0760, lng: 72.8777 } },
          { name: "Pune", state: "Maharashtra", country: "India", coordinates: { lat: 18.5204, lng: 73.8567 } },
          { name: "Nagpur", state: "Maharashtra", country: "India", coordinates: { lat: 21.1458, lng: 79.0882 } },
          { name: "Thane", state: "Maharashtra", country: "India", coordinates: { lat: 19.2183, lng: 72.9781 } },
          { name: "Nashik", state: "Maharashtra", country: "India", coordinates: { lat: 19.9975, lng: 73.7898 } }
        ]
      },
      {
        name: "Delhi",
        country: "India",
        cities: [
          { name: "New Delhi", state: "Delhi", country: "India", coordinates: { lat: 28.6139, lng: 77.2090 } },
          { name: "Delhi", state: "Delhi", country: "India", coordinates: { lat: 28.7041, lng: 77.1025 } },
          { name: "Gurgaon", state: "Delhi", country: "India", coordinates: { lat: 28.4595, lng: 77.0266 } },
          { name: "Noida", state: "Delhi", country: "India", coordinates: { lat: 28.5355, lng: 77.3910 } },
          { name: "Faridabad", state: "Delhi", country: "India", coordinates: { lat: 28.4089, lng: 77.3178 } }
        ]
      }
    ]
  },
  {
    name: "South Africa",
    code: "ZA",
    states: [
      {
        name: "Gauteng",
        country: "South Africa",
        cities: [
          { name: "Johannesburg", state: "Gauteng", country: "South Africa", coordinates: { lat: -26.2041, lng: 28.0473 } },
          { name: "Pretoria", state: "Gauteng", country: "South Africa", coordinates: { lat: -25.7479, lng: 28.2293 } },
          { name: "Soweto", state: "Gauteng", country: "South Africa", coordinates: { lat: -26.2485, lng: 27.9110 } },
          { name: "Tshwane", state: "Gauteng", country: "South Africa", coordinates: { lat: -25.7479, lng: 28.2293 } },
          { name: "Vereeniging", state: "Gauteng", country: "South Africa", coordinates: { lat: -26.6731, lng: 27.9261 } }
        ]
      },
      {
        name: "Western Cape",
        country: "South Africa",
        cities: [
          { name: "Cape Town", state: "Western Cape", country: "South Africa", coordinates: { lat: -33.9249, lng: 18.4241 } },
          { name: "Stellenbosch", state: "Western Cape", country: "South Africa", coordinates: { lat: -33.9326, lng: 18.8604 } },
          { name: "Paarl", state: "Western Cape", country: "South Africa", coordinates: { lat: -33.7342, lng: 18.9751 } },
          { name: "Worcester", state: "Western Cape", country: "South Africa", coordinates: { lat: -33.6458, lng: 19.4488 } },
          { name: "George", state: "Western Cape", country: "South Africa", coordinates: { lat: -33.9630, lng: 22.4617 } }
        ]
      }
    ]
  },
  {
    name: "Mexico",
    code: "MX",
    states: [
      {
        name: "Mexico City",
        country: "Mexico",
        cities: [
          { name: "Mexico City", state: "Mexico City", country: "Mexico", coordinates: { lat: 19.4326, lng: -99.1332 } },
          { name: "Iztapalapa", state: "Mexico City", country: "Mexico", coordinates: { lat: 19.3574, lng: -99.0591 } },
          { name: "Gustavo A. Madero", state: "Mexico City", country: "Mexico", coordinates: { lat: 19.4848, lng: -99.1103 } },
          { name: "Álvaro Obregón", state: "Mexico City", country: "Mexico", coordinates: { lat: 19.3574, lng: -99.2018 } },
          { name: "Coyoacán", state: "Mexico City", country: "Mexico", coordinates: { lat: 19.3500, lng: -99.1614 } }
        ]
      },
      {
        name: "Jalisco",
        country: "Mexico",
        cities: [
          { name: "Guadalajara", state: "Jalisco", country: "Mexico", coordinates: { lat: 20.6597, lng: -103.3496 } },
          { name: "Zapopan", state: "Jalisco", country: "Mexico", coordinates: { lat: 20.7236, lng: -103.3848 } },
          { name: "Tlaquepaque", state: "Jalisco", country: "Mexico", coordinates: { lat: 20.6409, lng: -103.2933 } },
          { name: "Tonalá", state: "Jalisco", country: "Mexico", coordinates: { lat: 20.6244, lng: -103.2342 } },
          { name: "Tlajomulco de Zúñiga", state: "Jalisco", country: "Mexico", coordinates: { lat: 20.4736, lng: -103.4470 } }
        ]
      }
    ]
  },
  {
    name: "Italy",
    code: "IT",
    states: [
      {
        name: "Lazio",
        country: "Italy",
        cities: [
          { name: "Rome", state: "Lazio", country: "Italy", coordinates: { lat: 41.9028, lng: 12.4964 } },
          { name: "Latina", state: "Lazio", country: "Italy", coordinates: { lat: 41.4679, lng: 12.9036 } },
          { name: "Guidonia Montecelio", state: "Lazio", country: "Italy", coordinates: { lat: 41.9994, lng: 12.7264 } },
          { name: "Fiumicino", state: "Lazio", country: "Italy", coordinates: { lat: 41.7704, lng: 12.2362 } },
          { name: "Viterbo", state: "Lazio", country: "Italy", coordinates: { lat: 42.4178, lng: 12.1088 } }
        ]
      },
      {
        name: "Lombardy",
        country: "Italy",
        cities: [
          { name: "Milan", state: "Lombardy", country: "Italy", coordinates: { lat: 45.4642, lng: 9.1900 } },
          { name: "Brescia", state: "Lombardy", country: "Italy", coordinates: { lat: 45.5416, lng: 10.2118 } },
          { name: "Bergamo", state: "Lombardy", country: "Italy", coordinates: { lat: 45.6949, lng: 9.6773 } },
          { name: "Monza", state: "Lombardy", country: "Italy", coordinates: { lat: 45.5845, lng: 9.2744 } },
          { name: "Como", state: "Lombardy", country: "Italy", coordinates: { lat: 45.8081, lng: 9.0852 } }
        ]
      }
    ]
  },
  {
    name: "Spain",
    code: "ES",
    states: [
      {
        name: "Madrid",
        country: "Spain",
        cities: [
          { name: "Madrid", state: "Madrid", country: "Spain", coordinates: { lat: 40.4168, lng: -3.7038 } },
          { name: "Alcalá de Henares", state: "Madrid", country: "Spain", coordinates: { lat: 40.4817, lng: -3.3641 } },
          { name: "Móstoles", state: "Madrid", country: "Spain", coordinates: { lat: 40.3226, lng: -3.8649 } },
          { name: "Fuenlabrada", state: "Madrid", country: "Spain", coordinates: { lat: 40.2842, lng: -3.7941 } },
          { name: "Leganés", state: "Madrid", country: "Spain", coordinates: { lat: 40.3272, lng: -3.7635 } }
        ]
      },
      {
        name: "Catalonia",
        country: "Spain",
        cities: [
          { name: "Barcelona", state: "Catalonia", country: "Spain", coordinates: { lat: 41.3851, lng: 2.1734 } },
          { name: "L'Hospitalet de Llobregat", state: "Catalonia", country: "Spain", coordinates: { lat: 41.3597, lng: 2.0997 } },
          { name: "Badalona", state: "Catalonia", country: "Spain", coordinates: { lat: 41.4500, lng: 2.2474 } },
          { name: "Sabadell", state: "Catalonia", country: "Spain", coordinates: { lat: 41.5489, lng: 2.1074 } },
          { name: "Terrassa", state: "Catalonia", country: "Spain", coordinates: { lat: 41.5689, lng: 2.0086 } }
        ]
      }
    ]
  },
  {
    name: "Netherlands",
    code: "NL",
    states: [
      {
        name: "North Holland",
        country: "Netherlands",
        cities: [
          { name: "Amsterdam", state: "North Holland", country: "Netherlands", coordinates: { lat: 52.3676, lng: 4.9041 } },
          { name: "Haarlem", state: "North Holland", country: "Netherlands", coordinates: { lat: 52.3792, lng: 4.6368 } },
          { name: "Zaanstad", state: "North Holland", country: "Netherlands", coordinates: { lat: 52.4538, lng: 4.8136 } },
          { name: "Hilversum", state: "North Holland", country: "Netherlands", coordinates: { lat: 52.2232, lng: 5.1764 } },
          { name: "Almere", state: "North Holland", country: "Netherlands", coordinates: { lat: 52.3508, lng: 5.2647 } }
        ]
      },
      {
        name: "South Holland",
        country: "Netherlands",
        cities: [
          { name: "Rotterdam", state: "South Holland", country: "Netherlands", coordinates: { lat: 51.9244, lng: 4.4777 } },
          { name: "The Hague", state: "South Holland", country: "Netherlands", coordinates: { lat: 52.0705, lng: 4.3007 } },
          { name: "Leiden", state: "South Holland", country: "Netherlands", coordinates: { lat: 52.1601, lng: 4.4970 } },
          { name: "Dordrecht", state: "South Holland", country: "Netherlands", coordinates: { lat: 51.8133, lng: 4.6901 } },
          { name: "Delft", state: "South Holland", country: "Netherlands", coordinates: { lat: 52.0116, lng: 4.3571 } }
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
