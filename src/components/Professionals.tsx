import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Star, Briefcase, MessageSquare, Filter, Loader2, X, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { getCountries, getStatesByCountry, getAllCitiesByCountry, searchCities, type City } from "@/data/cities";
import CitySelector from "@/components/CitySelector";
import { getCurrencySymbol, getCurrencyForCountry } from "@/lib/currency";
import ProfessionalProfileModal from "@/components/ProfessionalProfileModal";
import MessageModal from "@/components/MessageModal";

interface Professional {
  id: string;
  user_id: string;
  full_name: string;
  nickname: string;
  bio?: string;
  skills: string[];
  hourly_rate?: number;
  location?: string;
  country?: string;
  state?: string;
  city?: string;
  town?: string;
  avatar_url?: string;
  verified: boolean;
  created_at: string;
  currency_code?: string;
  currency_symbol?: string;
  // Computed fields
  rating?: number;
  completedProjects?: number;
}


export default function Professionals() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [rateFilter, setRateFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [townFilter, setTownFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{country: string, state: string, city: string} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [nearbyFilter, setNearbyFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance' | 'name'>('rating');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleViewProfile = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowProfileModal(true);
  };

  const handleHire = (professional: Professional) => {
    // TODO: Implement hire functionality
    console.log('Hiring:', professional);
  };

  const handleMessage = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowMessageModal(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Helper function to parse location string and extract state and city
  const parseLocation = (location: string) => {
    if (!location) return { city: '', state: '' };
    
    const parts = location.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      return {
        city: parts[0],
        state: parts[1]
      };
    } else if (parts.length === 1) {
      return {
        city: parts[0],
        state: ''
      };
    }
    return { city: '', state: '' };
  };

  // Get user's profile location instead of browser geolocation
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('country, location, state, city')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.log('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Set user location from profile data
  useEffect(() => {
    if (userProfile) {
      // Parse location string to extract state and city
      const parsedLocation = parseLocation(userProfile.location || '');
      
      setUserLocation({
        country: userProfile.country || 'Nigeria',
        state: parsedLocation.state,
        city: parsedLocation.city
      });
      setLocationPermission('granted');
    }
  }, [userProfile]);

  // Calculate distance between two locations (simplified)
  const calculateDistance = (prof: Professional) => {
    if (!userLocation) return 0;
    
    // Simple distance calculation based on location matching
    let distance = 0;
    if (prof.country !== userLocation.country) distance += 1000; // Different country
    else if (prof.state !== userLocation.state) distance += 100; // Different state
    else if (prof.city !== userLocation.city) distance += 50; // Different city
    else distance = Math.floor(Math.random() * 20); // Same city, random distance
    
    return distance;
  };

  // Fetch professionals from Supabase profiles table
  const { data: apiProfessionals = [], isLoading, error } = useQuery({
    queryKey: ['profiles', searchTerm, countryFilter, stateFilter, cityFilter, skillFilter, priceRange, nearbyFilter, userLocation?.country],
    queryFn: async () => {
      try {
        // First get all profiles with their user roles
        let query = supabase
          .from('profiles')
          .select(`
            *,
            user_roles!inner(role)
          `)
          .eq('user_roles.role', 'professional') // Only get professionals
          .order('created_at', { ascending: false });

        if (searchTerm) {
          query = query.or(`full_name.ilike.%${searchTerm}%,nickname.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`);
        }

        // Filter by country - default to user's country if no filter set
        const targetCountry = countryFilter && countryFilter !== "all-countries" 
          ? countryFilter 
          : userLocation?.country;
        
        if (targetCountry) {
          query = query.eq('country', targetCountry);
        }

        if (skillFilter && skillFilter !== "all-skills") {
          query = query.contains('skills', [skillFilter]);
        }

        // Filter by state if specified
        if (stateFilter && stateFilter !== "all-states") {
          query = query.ilike('location', `%${stateFilter}%`);
        }

        // Filter by city if specified
        if (cityFilter && cityFilter !== "all-cities") {
          query = query.ilike('location', `%${cityFilter}%`);
        }

        // Nearby filter - show only professionals from same state
        if (nearbyFilter && userLocation?.state) {
          query = query.ilike('location', `%${userLocation.state}%`);
        }

        if (priceRange[0] > 0) {
          query = query.gte('hourly_rate', priceRange[0]);
        }

        if (priceRange[1] < 100) {
          query = query.lte('hourly_rate', priceRange[1]);
        }

        const { data, error } = await query;
        
        console.log('Database query result:', { data, error });
        console.log('Number of professionals found:', data?.length || 0);
        
        if (error) {
          console.log('Database query error:', error);
          return [];
        }
        
        // Return actual data from database
        if (!data || data.length === 0) {
          console.log('No professionals found in database, trying alternative query...');
          
          // Try alternative query without join
          const { data: altData, error: altError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (altError) {
            console.log('Alternative query also failed:', altError);
            return [];
          }
          
          if (!altData || altData.length === 0) {
            console.log('No profiles found at all');
            return [];
          }
          
          // Filter for professionals manually
          const professionalIds = await supabase
            .from('user_roles')
            .select('user_id')
            .eq('role', 'professional');
            
          if (professionalIds.error) {
            console.log('Error fetching professional roles:', professionalIds.error);
            return [];
          }
          
          const profIds = professionalIds.data?.map(r => r.user_id) || [];
          const professionals = altData.filter(p => profIds.includes(p.user_id));
          
          console.log('Found professionals via alternative query:', professionals.length);
          console.log('Professional IDs from user_roles:', profIds);
          console.log('All profiles:', altData);
          console.log('Filtered professionals:', professionals);
          return professionals;
        }
        
        console.log('Found professionals:', data.length);
        return data;
      } catch (err) {
        console.log('Error fetching profiles:', err);
        return [];
      }
    },
    // Always allow fetching so visitors can browse professionals
    enabled: true,
  });

  // Get project counts for each professional
  const { data: projectCounts = {} } = useQuery({
    queryKey: ['project-counts', apiProfessionals.map(p => p.user_id)],
    queryFn: async () => {
      if (apiProfessionals.length === 0) return {};
      
      try {
        const userIds = apiProfessionals.map(p => p.user_id);
        const { data, error } = await supabase
          .from('projects')
          .select('professional_id')
          .in('professional_id', userIds)
          .eq('status', 'completed');
        
        if (error) {
          console.log('Error fetching project counts:', error);
          return {};
        }
        
        // Count projects per professional
        const counts: Record<string, number> = {};
        data?.forEach(project => {
          counts[project.professional_id] = (counts[project.professional_id] || 0) + 1;
        });
        
        return counts;
      } catch (err) {
        console.log('Error fetching project counts:', err);
        return {};
      }
    },
    enabled: apiProfessionals.length > 0,
  });

  // Convert API data to component format
  console.log('apiProfessionals before mapping:', apiProfessionals);
  const professionals = apiProfessionals.map((prof: {
    id: string;
    user_id: string;
    full_name: string;
    nickname: string;
    bio?: string;
    skills: string[];
    hourly_rate?: number;
    location?: string;
    country?: string;
    state?: string;
    city?: string;
    town?: string;
    avatar_url?: string;
    verified: boolean;
    created_at: string;
    currency_code?: string;
    currency_symbol?: string;
  }) => {
    // Parse location to extract state and city
    const parsedLocation = parseLocation(prof.location || '');
    
    // Get currency info from database or fallback to country-based currency
    const currencyCode = prof.currency_code || getCurrencyForCountry(prof.country || 'United States').code;
    const currencySymbol = prof.currency_symbol || getCurrencySymbol(prof.country || 'United States');
    
    return {
      id: prof.id,
      user_id: prof.user_id,
      full_name: prof.full_name || "Professional",
      nickname: prof.nickname || "Professional",
      bio: prof.bio,
      location: prof.location || "Location not specified",
      country: prof.country || "Unknown",
      state: parsedLocation.state,
      city: parsedLocation.city,
      town: "",
      skills: prof.skills || [],
      rating: 4.5, // Mock rating since not in profiles table
      hourly_rate: prof.hourly_rate || 0,
      currency_code: currencyCode,
      currency_symbol: currencySymbol,
      completedProjects: projectCounts[prof.user_id] || 0, // Real project count from database
      avatar_url: prof.avatar_url,
      verified: Math.random() > 0.3, // Mock verification
      created_at: prof.created_at,
    };
  });

  console.log('Final professionals array:', professionals);
  console.log('Number of professionals to display:', professionals.length);

  // Professionals will be fetched from Supabase database

  // Get unique location data for hierarchical filtering
  const uniqueCountries = Array.from(new Set(professionals.map(p => p.country))).sort();
  const uniqueStates = Array.from(new Set(professionals.map(p => p.state).filter(Boolean))).sort();
  const uniqueCities = Array.from(new Set(professionals.map(p => p.city).filter(Boolean))).sort();
  
  console.log('Unique countries:', uniqueCountries);
  console.log('Unique states:', uniqueStates);
  console.log('Unique cities:', uniqueCities);
  
  // Add sample data for testing if no real data
  const sampleStates = uniqueStates.length > 0 ? uniqueStates : ['Bayelsa', 'Lagos', 'Abuja', 'Rivers', 'Kano'];
  const sampleCities = uniqueCities.length > 0 ? uniqueCities : ['Yenagoa', 'Lagos', 'Abuja', 'Port Harcourt', 'Kano'];
  const uniqueTowns = Array.from(new Set(professionals.map(p => p.town).filter(Boolean))).sort();

  // All available countries for the dropdown
  const allCountries = [
    "Nigeria", "USA", "UK", "Canada", "Germany", "France", "Australia", "Japan", 
    "Brazil", "India", "South Africa", "Mexico", "Italy", "Spain", "Netherlands"
  ];
  
  // Get unique skills for skill filter
  const allSkills = professionals.flatMap(p => p.skills);
  const uniqueSkills = Array.from(new Set(allSkills)).sort();

  // Filter states, cities, and towns based on selected country
  const filteredStates = countryFilter 
    ? uniqueStates.filter(state => 
        professionals.some(p => p.country === countryFilter && p.state === state)
      )
    : uniqueStates;

  const filteredCities = (countryFilter || stateFilter)
    ? uniqueCities.filter(city => 
        professionals.some(p => 
          (!countryFilter || p.country === countryFilter) &&
          (!stateFilter || p.state === stateFilter) &&
          p.city === city
        )
      )
    : uniqueCities;

  const filteredTowns = (countryFilter || stateFilter || cityFilter)
    ? uniqueTowns.filter(town => 
        professionals.some(p => 
          (!countryFilter || p.country === countryFilter) &&
          (!stateFilter || p.state === stateFilter) &&
          (!cityFilter || p.city === cityFilter) &&
          p.town === town
        )
      )
    : uniqueTowns;

  // Filter professionals based on all criteria
  const filteredProfessionals = professionals.filter(professional => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      professional.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (professional.bio && professional.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      professional.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Country filter
    const matchesCountry = countryFilter === "" || countryFilter === "all-countries" || professional.country === countryFilter;
    
    // City filter using selectedCity
    const matchesCity = !selectedCity || 
      professional.location.toLowerCase().includes(selectedCity.name.toLowerCase()) ||
      professional.location.toLowerCase().includes(selectedCity.state.toLowerCase()) ||
      professional.location.toLowerCase().includes(selectedCity.country.toLowerCase());
    
    // Nearby filter
    const matchesNearby = !nearbyFilter || (userLocation && 
      (professional.country === userLocation.country && 
       professional.state === userLocation.state && 
       professional.city === userLocation.city));
    
    // Rating filter
    const matchesRating = ratingFilter === "" || ratingFilter === "any-rating" || 
      (ratingFilter === "4+" && professional.rating >= 4) ||
      (ratingFilter === "4.5+" && professional.rating >= 4.5) ||
      (ratingFilter === "5" && professional.rating === 5);
    
    // Price range filter
    const matchesPriceRange = (professional.hourly_rate || 0) >= priceRange[0] && (professional.hourly_rate || 0) <= priceRange[1];
    
    // Verified filter
    const matchesVerified = !verifiedFilter || professional.verified;
    
    // Availability filter (mock - in real app this would come from API)
    const matchesAvailability = availabilityFilter === "" || availabilityFilter === "any-availability" || 
      (availabilityFilter === "available" && Math.random() > 0.3) || // Mock availability
      (availabilityFilter === "busy" && Math.random() < 0.3);
    
    return matchesSearch && matchesCountry && matchesCity && matchesNearby && matchesRating && matchesPriceRange && matchesVerified && matchesAvailability;
  });

  // Sort professionals
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.hourlyRate - b.hourlyRate;
      case 'distance':
        return calculateDistance(a) - calculateDistance(b);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSkillFilter("");
    setRateFilter("");
    setCountryFilter("");
    setStateFilter("");
    setCityFilter("");
    setSelectedCity(null);
    setTownFilter("");
    setRatingFilter("");
    setAvailabilityFilter("");
    setVerifiedFilter(false);
    setPriceRange([0, 100]);
    setNearbyFilter(false);
    setSortBy('rating');
  };

  // Count active filters
  const activeFiltersCount = [
    searchTerm,
    skillFilter && skillFilter !== "all-skills" ? skillFilter : "",
    rateFilter,
    countryFilter && countryFilter !== "all-countries" ? countryFilter : "",
    stateFilter && stateFilter !== "all-states" ? stateFilter : "",
    cityFilter && cityFilter !== "all-cities" ? cityFilter : "",
    selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : "",
    ratingFilter && ratingFilter !== "any-rating" ? ratingFilter : "",
    availabilityFilter && availabilityFilter !== "any-availability" ? availabilityFilter : "",
    verifiedFilter,
    nearbyFilter,
    priceRange[0] !== 0 || priceRange[1] !== 100,
    sortBy !== 'rating'
  ].filter(Boolean).length;

  // No longer need useEffect for filtering as we filter directly in the render

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Page Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Professionals Nearby
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with verified professionals from your country. Find the perfect match for your project.
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar - Full Width */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                             <Input
                 placeholder="Search for skills, services, or professionals..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
               />
            </div>
            
            {/* Filter Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <Select value={countryFilter} onValueChange={(value) => {
                setCountryFilter(value);
                setStateFilter("");
                setCityFilter("");
                setTownFilter("");
              }}>
              <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
              </SelectTrigger>
                             <SelectContent>
                  <SelectItem value="all-countries">All Countries</SelectItem>
                  {allCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
               </SelectContent>
            </Select>

              {/* State Filter */}
              <Select value={stateFilter} onValueChange={(value) => {
                setStateFilter(value);
                setCityFilter("");
                setTownFilter("");
              }}>
              <SelectTrigger>
                  <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all-states">All States</SelectItem>
                  {sampleStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
               </SelectContent>
            </Select>

              {/* City Filter */}
              <Select value={cityFilter} onValueChange={(value) => {
                setCityFilter(value);
                setTownFilter("");
              }}>
              <SelectTrigger>
                  <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all-cities">All Cities</SelectItem>
                  {sampleCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
               </SelectContent>
            </Select>
              
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                  <SelectValue placeholder="Minimum Rating" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="any-rating">Any Rating</SelectItem>
                  <SelectItem value="4+">4+ Stars</SelectItem>
                  <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                  <SelectItem value="5">5 Stars Only</SelectItem>
              </SelectContent>
            </Select>
              
              <div className="flex gap-2">
                {/* Location Detection Button */}
                {locationPermission === 'prompt' && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setUserLocation({
                              country: "Nigeria",
                              state: "Lagos", 
                              city: "Lagos"
                            });
                            setLocationPermission('granted');
                          },
                          (error) => {
                            setLocationPermission('denied');
                          }
                        );
                      }
                    }}
                    className="flex items-center gap-2 flex-1"
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="hidden sm:inline">Detect Location</span>
                    <span className="sm:hidden">Detect</span>
                  </Button>
                )}
                
                {/* Nearby Filter */}
                {userLocation && (
                  <Button 
                    variant={nearbyFilter ? "default" : "outline"}
                    onClick={() => setNearbyFilter(!nearbyFilter)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="hidden sm:inline">Nearby Only</span>
                    <span className="sm:hidden">Nearby</span>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Filter Row 2 */}
            <div className="flex flex-wrap gap-2">
              <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Advanced Filters</span>
                    <span className="sm:hidden">Filters</span>
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Advanced Filters</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Location Filters */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Location</Label>
                      <CitySelector
                        value={selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : ""}
                        onChange={setSelectedCity}
                        placeholder="Select a city to filter by location..."
                      />
                    </div>

                    {/* Skills Filter */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Skills & Services</Label>
                      <Select value={skillFilter} onValueChange={setSkillFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a skill or service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-skills">All Skills</SelectItem>
                          {uniqueSkills.map((skill) => (
                            <SelectItem key={String(skill)} value={String(skill)}>
                              {String(skill)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Hourly Rate: $0 - $100 (USD)
                      </Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Availability */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Availability</Label>
                      <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Availability status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any-availability">Any Availability</SelectItem>
                          <SelectItem value="available">Available Now</SelectItem>
                          <SelectItem value="busy">Currently Busy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Verified Only */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified"
                        checked={verifiedFilter}
                        onCheckedChange={(checked) => setVerifiedFilter(checked as boolean)}
                      />
                      <Label htmlFor="verified" className="text-sm">
                        Verified professionals only
                      </Label>
                    </div>

                    {/* Nearby Filter */}
                    {userLocation && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="nearby"
                          checked={nearbyFilter}
                          onCheckedChange={(checked) => setNearbyFilter(checked as boolean)}
                        />
                        <Label htmlFor="nearby" className="text-sm">
                          Show only professionals in {userLocation.city}, {userLocation.state}
                        </Label>
                      </div>
                    )}

                    {/* Sort Options */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Sort By</Label>
                      <Select value={sortBy} onValueChange={(value: string) => setSortBy(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort professionals by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Highest Rating</SelectItem>
                          <SelectItem value="price">Lowest Price</SelectItem>
                          <SelectItem value="distance">Nearest First</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex justify-between pt-4 border-t">
                      <Button variant="outline" onClick={clearAllFilters}>
                        Clear All Filters
                      </Button>
                      <Button onClick={() => setShowAdvancedFilters(false)}>
                        Apply Filters
            </Button>
          </div>
                  </div>
                </DialogContent>
              </Dialog>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="px-3">
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Clear All</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                </Badge>
              )}
              {countryFilter && countryFilter !== "all-countries" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Country: {countryFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => {
                    setCountryFilter("");
                    setStateFilter("");
                    setCityFilter("");
                    setTownFilter("");
                  }} />
                </Badge>
              )}
              {stateFilter && stateFilter !== "all-states" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  State: {stateFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => {
                    setStateFilter("");
                    setCityFilter("");
                    setTownFilter("");
                  }} />
                </Badge>
              )}
              {cityFilter && cityFilter !== "all-cities" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  City: {cityFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => {
                    setCityFilter("");
                    setTownFilter("");
                  }} />
                </Badge>
              )}
              {townFilter && townFilter !== "all-towns" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Town: {townFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setTownFilter("")} />
                </Badge>
              )}
              {ratingFilter && ratingFilter !== "any-rating" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Rating: {ratingFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setRatingFilter("")} />
                </Badge>
              )}
              {skillFilter && skillFilter !== "all-skills" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Skill: {skillFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSkillFilter("")} />
                </Badge>
              )}
              {(priceRange[0] !== 0 || priceRange[1] !== 100) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: ${priceRange[0]}-${priceRange[1]}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange([0, 100])} />
                </Badge>
              )}
              {verifiedFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Verified Only
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setVerifiedFilter(false)} />
                </Badge>
              )}
              {availabilityFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {availabilityFilter === "available" ? "Available Now" : "Currently Busy"}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setAvailabilityFilter("")} />
                </Badge>
              )}
              {nearbyFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Nearby Only
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setNearbyFilter(false)} />
                </Badge>
              )}
              {sortBy !== 'rating' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sort: {sortBy === 'price' ? 'Price' : sortBy === 'distance' ? 'Distance' : sortBy === 'name' ? 'Name' : 'Rating'}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSortBy('rating')} />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {sortedProfessionals.length} of {professionals.length} professionals
            {userLocation && (
              <span className="ml-2 text-sm">
                • Your location: {userLocation.city}, {userLocation.state}, {userLocation.country}
              </span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading professionals...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive mb-4">Failed to load professionals</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        )}

        {/* Professionals Grid */}
        {!error && (          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProfessionals.map((professional) => {
                const distance = calculateDistance(professional);
                return (
                <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={professional.avatar_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(professional.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{professional.full_name}</CardTitle>
                          <CardDescription className="text-sm">
                            @{professional.nickname}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                      {professional.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      )}
                        {userLocation && (
                          <Badge 
                            variant={distance < 50 ? "default" : distance < 100 ? "secondary" : "outline"}
                            className={distance < 50 ? "bg-blue-100 text-blue-800" : distance < 100 ? "bg-yellow-100 text-yellow-800" : ""}
                          >
                            {distance < 50 ? "Same City" : distance < 100 ? "Same State" : distance < 1000 ? "Same Country" : "International"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{professional.location}</span>
                      {userLocation && distance < 1000 && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {distance < 50 ? "Same City" : distance < 100 ? "Same State" : "Same Country"}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{professional.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{professional.completedProjects} projects</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {professional.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {professional.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {professional.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{professional.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-lg font-semibold text-primary">
                        {professional.currency_symbol}{professional.hourly_rate}/hr
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMessage(professional)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleViewProfile(professional)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>

            {sortedProfessionals.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">No professionals available yet</h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    We're building our community of skilled professionals. Check back soon or spread the word to help us grow!
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Share SeekCa with professionals you know to help build our marketplace
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="outline" asChild>
                        <a href="mailto:?subject=Join SeekCa Marketplace&body=Check out SeekCa - a marketplace for professionals and hirers! Visit us at https://www.seekca.org/">
                          Share via Email
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="https://x.com/intent/tweet?text=Check%20out%20SeekCa%20-%20a%20marketplace%20for%20professionals%20and%20hirers!%20https://www.seekca.org/" target="_blank" rel="noopener noreferrer">
                          Share on X
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ProfessionalProfileModal
        professional={selectedProfessional}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onHire={handleHire}
        onMessage={handleMessage}
      />
      
      <MessageModal
        professional={selectedProfessional}
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
      />
    </div>
  );
}
