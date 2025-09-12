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
import { Search, MapPin, Star, Briefcase, MessageSquare, Filter, Loader2, X } from "lucide-react";
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

  // Use API hook for data fetching
  const { data: apiProfessionals = [], isLoading, error } = useProfessionals({
    skills: skillFilter && skillFilter !== "all-skills" ? [skillFilter] : undefined,
    minRate: rateFilter === "low" ? 0 : rateFilter === "medium" ? 30 : rateFilter === "high" ? 50 : undefined,
    maxRate: rateFilter === "low" ? 30 : rateFilter === "medium" ? 50 : undefined,
  });

  // Convert API data to component format
  const professionals = apiProfessionals.map(prof => ({
    id: prof.id,
    name: prof.nickname || prof.full_name,
    title: prof.bio || "Professional Service Provider",
    location: prof.location || "Location not specified",
    country: prof.country || "Unknown",
    state: prof.state || "",
    city: prof.city || "",
    town: prof.town || "",
    skills: prof.skills || [],
    rating: 4.5, // Default rating
    hourlyRate: prof.hourlyRate || 0,
    completedProjects: Math.floor(Math.random() * 100), // Mock completed projects
    avatar: prof.avatar_url,
    description: prof.bio || "Professional service provider",
    verified: prof.verified || false,
  }));

  // Mock data - in a real app, this would come from your Supabase database
  const mockProfessionals: Professional[] = [
    // Nigeria professionals - Physical services like Thumbtack
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Kitchen & Bathroom Remodeling Specialist",
      location: "Victoria Island, Lagos, Nigeria",
      country: "Nigeria",
      state: "Lagos",
      city: "Lagos",
      town: "Victoria Island",
      skills: ["Kitchen Remodeling", "Bathroom Remodeling", "Interior Painting", "Tile Installation", "Flooring Installation", "Cabinet Installation", "Countertop Installation"],
      rating: 4.9,
      hourlyRate: 25,
      completedProjects: 47,
      description: "Experienced contractor with 5+ years transforming homes. Licensed and insured for all renovation projects.",
      verified: true,
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Plumbing & Electrical Expert",
      location: "Asokoro, Abuja, Nigeria",
      country: "Nigeria",
      state: "FCT",
      city: "Abuja",
      town: "Asokoro",
      skills: ["Plumbing", "Electrical Work", "HVAC Services", "Appliance Repairs", "Garage Door Repairs", "Furnace Repairs"],
      rating: 4.8,
      hourlyRate: 30,
      completedProjects: 32,
      description: "Certified plumber and electrician. Emergency services available 24/7 for urgent repairs.",
      verified: true,
    },
    {
      id: "3",
      name: "David Okafor",
      title: "Landscaping & Garden Design",
      location: "GRA Phase 2, Port Harcourt, Nigeria",
      country: "Nigeria",
      state: "Rivers",
      city: "Port Harcourt",
      town: "GRA Phase 2",
      skills: ["Garden Design", "Irrigation Systems", "Tree Trimming", "Outdoor Lighting"],
      rating: 4.7,
      hourlyRate: 35,
      completedProjects: 28,
      description: "Creative landscaper specializing in sustainable garden designs and maintenance.",
      verified: true,
    },
    {
      id: "4",
      name: "Lisa Adebayo",
      title: "Cleaning & Maintenance Pro",
      location: "Bodija, Ibadan, Nigeria",
      country: "Nigeria",
      state: "Oyo",
      city: "Ibadan",
      town: "Bodija",
      skills: ["Deep Cleaning", "Carpet Cleaning", "Window Washing", "Office Maintenance"],
      rating: 4.9,
      hourlyRate: 40,
      completedProjects: 23,
      description: "Professional cleaning services for homes and offices. Eco-friendly products available.",
      verified: true,
    },
    {
      id: "5",
      name: "James Okonkwo",
      title: "Auto Repair & Maintenance",
      location: "New Haven, Enugu, Nigeria",
      country: "Nigeria",
      state: "Enugu",
      city: "Enugu",
      town: "New Haven",
      skills: ["Engine Repair", "Brake Service", "Oil Change", "Diagnostic Testing"],
      rating: 4.6,
      hourlyRate: 28,
      completedProjects: 35,
      description: "Certified mechanic with 10+ years experience. All major car brands serviced.",
      verified: true,
    },
    // US professionals - Local physical services
    {
      id: "6",
      name: "Alex Thompson",
      title: "House Cleaning Specialist",
      location: "Mission District, San Francisco, CA, USA",
      country: "USA",
      state: "California",
      city: "San Francisco",
      town: "Mission District",
      skills: ["Move-in Cleaning", "Deep Cleaning", "Eco-friendly", "Pet-friendly"],
      rating: 4.8,
      hourlyRate: 45,
      completedProjects: 52,
      description: "Professional house cleaning with attention to detail. Bonded and insured.",
      verified: true,
    },
    {
      id: "7",
      name: "Emma Wilson",
      title: "Handyman Services",
      location: "Brooklyn, New York, NY, USA",
      country: "USA",
      state: "New York",
      city: "New York",
      town: "Brooklyn",
      skills: ["Furniture Assembly", "Minor Repairs", "Installation", "General Maintenance"],
      rating: 4.7,
      hourlyRate: 50,
      completedProjects: 38,
      description: "Reliable handyman for all your home repair and assembly needs.",
      verified: true,
    },
    // UK professionals - Local physical services
    {
      id: "8",
      name: "Oliver Brown",
      title: "Garden & Landscaping",
      location: "London, UK",
      country: "UK",
      skills: ["Garden Design", "Lawn Care", "Tree Surgery", "Patio Installation"],
      rating: 4.9,
      hourlyRate: 42,
      completedProjects: 41,
      description: "Professional gardener and landscaper. Creating beautiful outdoor spaces.",
      verified: true,
    },
         // Canada professionals - Local physical services
     {
       id: "9",
       name: "Sophie Martin",
       title: "Home Organization Expert",
       location: "Toronto, Canada",
       country: "Canada",
       skills: ["Closet Organization", "Decluttering", "Storage Solutions", "Moving Prep"],
       rating: 4.8,
       hourlyRate: 38,
       completedProjects: 29,
       description: "Professional organizer helping create functional and beautiful living spaces.",
       verified: true,
     },
     // New professionals with missing skill categories
     {
       id: "10",
       name: "Robert Williams",
       title: "Licensed Architect & Designer",
       location: "Lagos, Nigeria",
       country: "Nigeria",
       skills: ["Architectural Design", "Building Plans", "Structural Engineering", "3D Modeling", "Site Planning", "Sustainable Design"],
       rating: 4.9,
       hourlyRate: 45,
       completedProjects: 23,
       description: "Registered architect with 8+ years designing residential and commercial buildings. Specializes in sustainable and modern designs.",
       verified: true,
     },
     {
       id: "11",
       name: "Ahmed Hassan",
       title: "Land Surveyor & Civil Engineer",
       location: "Abuja, Nigeria",
       country: "Nigeria",
       skills: ["Land Surveying", "Property Boundaries", "Topographic Surveys", "GPS Surveying", "Civil Engineering", "Construction Surveying"],
       rating: 4.7,
       hourlyRate: 40,
       completedProjects: 31,
       description: "Professional surveyor and civil engineer. Accurate property measurements and construction site surveying.",
       verified: true,
     },
     {
       id: "12",
       name: "Maria Rodriguez",
       title: "Certified Auto Mechanic",
       location: "Port Harcourt, Nigeria",
       country: "Nigeria",
       skills: ["Auto Repair", "Engine Repair", "Brake Service", "Diagnostic Testing", "Transmission Repair", "Electrical Systems"],
       rating: 4.8,
       hourlyRate: 35,
       completedProjects: 67,
       description: "ASE certified mechanic with 12+ years experience. All major car brands and comprehensive auto services.",
       verified: true,
     },
     {
       id: "13",
       name: "John O'Connor",
       title: "Professional Welder & Metal Fabricator",
       location: "Enugu, Nigeria",
       country: "Nigeria",
       skills: ["Arc Welding", "MIG Welding", "TIG Welding", "Metal Fabrication", "Steel Work", "Pipe Welding", "Custom Metal Projects"],
       rating: 4.6,
       hourlyRate: 32,
       completedProjects: 42,
       description: "Skilled welder specializing in structural steel, custom metalwork, and industrial fabrication projects.",
       verified: true,
     },
     {
       id: "14",
       name: "David Thompson",
       title: "General Contractor & Builder",
       location: "Kano, Nigeria",
       country: "Nigeria",
       skills: ["General Contracting", "Carpentry", "Masonry", "Concrete Work", "Framing", "Foundation Work", "Project Management"],
       rating: 4.9,
       hourlyRate: 38,
       completedProjects: 28,
       description: "Experienced contractor handling complete construction projects from foundation to finish.",
       verified: true,
     },
  ];

  // Get unique location data for hierarchical filtering
  const uniqueCountries = Array.from(new Set(professionals.map(p => p.country))).sort();
  const uniqueStates = Array.from(new Set(professionals.map(p => p.state).filter(Boolean))).sort();
  const uniqueCities = Array.from(new Set(professionals.map(p => p.city).filter(Boolean))).sort();
  const uniqueTowns = Array.from(new Set(professionals.map(p => p.town).filter(Boolean))).sort();
  
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
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for skills, services, or professionals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={countryFilter} onValueChange={(value) => {
              setCountryFilter(value);
              setStateFilter("");
              setCityFilter("");
              setTownFilter("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-countries">All Countries</SelectItem>
                {uniqueCountries.map((country) => (
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
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Detect Location
                </Button>
              )}
              
              {/* Nearby Filter */}
              {userLocation && (
                <Button 
                  variant={nearbyFilter ? "default" : "outline"}
                  onClick={() => setNearbyFilter(!nearbyFilter)}
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Nearby Only
                </Button>
              )}
              
              <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 flex-1">
                    <Filter className="w-4 h-4" />
                    Advanced Filters
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

            {sortedProfessionals.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No professionals found</h3>
                  <p>Try adjusting your search criteria or filters.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
