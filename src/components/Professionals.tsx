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
import { useProfessionals } from "@/hooks/use-api";
import { Link } from "react-router-dom";

interface Professional {
  id: string;
  name: string;
  title: string;
  location: string;
  country: string;
  state?: string;
  city?: string;
  town?: string;
  skills: string[];
  rating: number;
  hourlyRate: number;
  completedProjects: number;
  avatar?: string;
  description: string;
  verified: boolean;
}

export default function Professionals() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [rateFilter, setRateFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
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

  // Location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would reverse geocode the coordinates to get location details
          // For now, we'll use a mock location detection
          setUserLocation({
            country: "Nigeria", // This would be determined from coordinates
            state: "Lagos",
            city: "Lagos"
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.log('Location access denied:', error);
          setLocationPermission('denied');
        }
      );
    } else {
      setLocationPermission('denied');
    }
  }, []);

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

  // Fetch professionals from Supabase database
  const { data: apiProfessionals = [], isLoading, error } = useQuery({
    queryKey: ['professionals', searchTerm, countryFilter, stateFilter, cityFilter, townFilter, skillFilter, ratingFilter, verifiedFilter, nearbyFilter, priceRange, sortBy],
    queryFn: async () => {
      try {
        let query = supabase
          .from('professionals')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (searchTerm) {
          query = query.or(`name.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,skills.cs.{${searchTerm}}`);
        }

        if (countryFilter && countryFilter !== "all-countries") {
          query = query.eq('country', countryFilter);
        }

        if (stateFilter && stateFilter !== "all-states") {
          query = query.eq('state', stateFilter);
        }

        if (cityFilter && cityFilter !== "all-cities") {
          query = query.eq('city', cityFilter);
        }

        if (townFilter && townFilter !== "all-towns") {
          query = query.eq('town', townFilter);
        }

        if (skillFilter && skillFilter !== "all-skills") {
          query = query.contains('skills', [skillFilter]);
        }

        if (ratingFilter && ratingFilter !== "any-rating") {
          const minRating = ratingFilter === "4+" ? 4 : ratingFilter === "4.5+" ? 4.5 : 5;
          query = query.gte('rating', minRating);
        }

        if (verifiedFilter) {
          query = query.eq('verified', true);
        }

        if (priceRange[0] > 0) {
          query = query.gte('hourly_rate', priceRange[0]);
        }

        if (priceRange[1] < 100) {
          query = query.lte('hourly_rate', priceRange[1]);
        }

        const { data, error } = await query;
        
        if (error) {
          console.log('Database query error (this is expected if professionals table doesn\'t exist yet):', error);
          return [];
        }
        
        return data || [];
      } catch (err) {
        console.log('Error fetching professionals (this is expected if database tables don\'t exist yet):', err);
        return [];
      }
    },
    enabled: !!user,
  });

  // Convert API data to component format
  const professionals = apiProfessionals.map(prof => ({
    id: prof.id,
    name: prof.name || prof.full_name,
    title: prof.title || prof.bio || "Professional Service Provider",
    location: prof.location || "Location not specified",
    country: prof.country || "Unknown",
    state: prof.state || "",
    city: prof.city || "",
    town: prof.town || "",
    skills: prof.skills || [],
    rating: prof.rating || 4.5,
    hourlyRate: prof.hourly_rate || 0,
    completedProjects: prof.completed_projects || 0,
    avatar: prof.avatar_url,
    description: prof.description || prof.bio || "Professional service provider",
    verified: prof.verified || false,
  }));

  // Professionals will be fetched from Supabase database

  // Get unique location data for hierarchical filtering
  const uniqueCountries = Array.from(new Set(professionals.map(p => p.country))).sort();
  const uniqueStates = Array.from(new Set(professionals.map(p => p.state).filter(Boolean))).sort();
  const uniqueCities = Array.from(new Set(professionals.map(p => p.city).filter(Boolean))).sort();
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
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Hierarchical location filters
    const matchesCountry = countryFilter === "" || countryFilter === "all-countries" || professional.country === countryFilter;
    const matchesState = stateFilter === "" || stateFilter === "all-states" || professional.state === stateFilter;
    const matchesCity = cityFilter === "" || cityFilter === "all-cities" || professional.city === cityFilter;
    const matchesTown = townFilter === "" || townFilter === "all-towns" || professional.town === townFilter;
    
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
    const matchesPriceRange = professional.hourlyRate >= priceRange[0] && professional.hourlyRate <= priceRange[1];
    
    // Verified filter
    const matchesVerified = !verifiedFilter || professional.verified;
    
    // Availability filter (mock - in real app this would come from API)
    const matchesAvailability = availabilityFilter === "" || availabilityFilter === "any-availability" || 
      (availabilityFilter === "available" && Math.random() > 0.3) || // Mock availability
      (availabilityFilter === "busy" && Math.random() < 0.3);
    
    return matchesSearch && matchesCountry && matchesState && matchesCity && matchesTown && matchesNearby && matchesRating && matchesPriceRange && matchesVerified && matchesAvailability;
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
    townFilter && townFilter !== "all-towns" ? townFilter : "",
    ratingFilter && ratingFilter !== "any-rating" ? ratingFilter : "",
    availabilityFilter && availabilityFilter !== "any-availability" ? availabilityFilter : "",
    verifiedFilter,
    nearbyFilter,
    priceRange[0] !== 0 || priceRange[1] !== 100,
    sortBy !== 'rating'
  ].filter(Boolean).length;

  // No longer need useEffect for filtering as we filter directly in the render

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                      <div className="grid grid-cols-2 gap-3">
                        <Select value={stateFilter} onValueChange={(value) => {
                          setStateFilter(value);
                          setCityFilter("");
                          setTownFilter("");
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="State/Province" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-states">All States</SelectItem>
                            {filteredStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={cityFilter} onValueChange={(value) => {
                          setCityFilter(value);
                          setTownFilter("");
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="City" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-cities">All Cities</SelectItem>
                            {filteredCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={townFilter} onValueChange={setTownFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Town/Area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-towns">All Towns</SelectItem>
                            {filteredTowns.map((town) => (
                              <SelectItem key={town} value={town}>
                                {town}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
                            <SelectItem key={skill} value={skill}>
                              {skill}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Hourly Rate: ${priceRange[0]} - ${priceRange[1]}
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
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
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
            Showing {sortedProfessionals.length} of {professionals.length} service providers
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
                          <AvatarImage src={professional.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(professional.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{professional.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {professional.title}
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
                        ${professional.hourlyRate}/hr
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm">
                          Hire Now
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
                        <a href="mailto:?subject=Join SeekCa Marketplace&body=Check out SeekCa - a marketplace for professionals and hirers!">
                          Share via Email
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="https://twitter.com/intent/tweet?text=Check%20out%20SeekCa%20-%20a%20marketplace%20for%20professionals%20and%20hirers!" target="_blank">
                          Share on Twitter
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
    </div>
  );
}
