export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "exterior",
    name: "Exterior Home Care",
    skills: [
      "Roofing",
      "House Painting",
      "Window Washing",
      "Chimney Sweeps",
      "Pool Maintenance",
      "Gutter Cleaning",
      "Deck Contractors",
      "Siding Installation",
      "Concrete & Masonry",
      "Exterior Lighting",
      "Fence Installation",
      "Driveway Paving",
      "Exterior Insulation",
      "Weatherproofing"
    ]
  },
  {
    id: "cleaning",
    name: "Cleaning & Organization",
    skills: [
      "House Cleaning",
      "Carpet Cleaning",
      "Upholstery Cleaning",
      "Home Organization",
      "Deep Cleaning",
      "Junk Removal",
      "Duct & Vent Cleaning",
      "Pool Cleaning",
      "Commercial Cleaning",
      "Move-in/Move-out Cleaning",
      "Post-Construction Cleaning",
      "Green Cleaning",
      "Closet Organization",
      "Storage Solutions",
      "Decluttering Services"
    ]
  },
  {
    id: "repairs",
    name: "Home Repairs & Maintenance",
    skills: [
      "Plumbing",
      "Locksmith Services",
      "Appliance Repairs",
      "Garage Door Repairs",
      "Handyman Services",
      "Furnace Repairs",
      "HVAC Services",
      "Electrical Work",
      "Windows & Doors",
      "General Contracting",
      "Carpentry",
      "Bathroom Repairs",
      "Kitchen Repairs",
      "Floor Repairs",
      "Wall Repairs",
      "Ceiling Repairs",
      "Foundation Repairs",
      "Roof Repairs"
    ]
  },
  {
    id: "renovations",
    name: "Renovations & Upgrades",
    skills: [
      "Kitchen Remodeling",
      "Bathroom Remodeling",
      "Flooring Installation",
      "Interior Design",
      "Carpet Installation",
      "Interior Painting",
      "Basement Remodeling",
      "Attic Conversion",
      "Room Additions",
      "Cabinet Installation",
      "Countertop Installation",
      "Backsplash Installation",
      "Staircase Remodeling",
      "Fireplace Remodeling",
      "Home Theater Setup",
      "Smart Home Installation"
    ]
  },
  {
    id: "landscaping",
    name: "Landscaping & Outdoor Services",
    skills: [
      "Lawn Care",
      "Landscaping Design",
      "Gardening",
      "Tree Trimming",
      "Sprinkler System Repairs",
      "Artificial Turf Installation",
      "Stump Grinding",
      "Sod Installation",
      "Arborist Services",
      "Irrigation Systems",
      "Outdoor Lighting",
      "Patio Installation",
      "Walkway Installation",
      "Retaining Walls",
      "Water Features",
      "Garden Maintenance",
      "Seasonal Cleanup"
    ]
  },
  {
    id: "installation",
    name: "Installation & Assembly",
    skills: [
      "Holiday Light Hanging",
      "TV Mounting",
      "Security Camera Installation",
      "Appliance Installation",
      "Furniture Assembly",
      "Ceiling Fan Installation",
      "Generator Installation",
      "Art & Picture Hanging",
      "Gym Equipment Assembly",
      "Shelving Installation",
      "Closet Systems",
      "Blind Installation",
      "Curtain Rod Installation",
      "Mirror Installation",
      "Chandelier Installation",
      "Home Office Setup"
    ]
  },
  {
    id: "pest",
    name: "Pest Control",
    skills: [
      "Pest Control",
      "Mosquito Control",
      "Rodent Control",
      "Bee Removal",
      "Bed Bug Extermination",
      "Wasp Nest Removal",
      "Termite Control",
      "Dead Animal Removal",
      "Bird Control",
      "Ant Control",
      "Spider Control",
      "Cockroach Control",
      "Flea Control",
      "Tick Control",
      "Wildlife Removal",
      "Preventive Pest Control"
    ]
  },
  {
    id: "trending",
    name: "Trending Services",
    skills: [
      "Event Planning",
      "Heat Pump Installation",
      "Foundation Inspection",
      "Karaoke Rental",
      "Private After School Lessons",
      "Concrete Delivery",
      "Solar Panel Installation",
      "Electric Vehicle Charger Installation",
      "Home Automation",
      "Virtual Reality Setup",
      "Drone Photography",
      "3D Printing Services",
      "Cryptocurrency Mining Setup",
      "Home Gym Design",
      "Wine Cellar Construction"
    ]
  },
  {
    id: "events",
    name: "Events",
    skills: [
      "Catering",
      "Makeup Artistry",
      "DJ Services",
      "Photography",
      "Wedding Planning",
      "Limo/Car Rental",
      "Event Decoration",
      "Live Music",
      "Videography",
      "Event Coordination",
      "Party Planning",
      "Corporate Event Planning",
      "Birthday Party Planning",
      "Anniversary Celebrations",
      "Graduation Parties"
    ]
  },
  {
    id: "wellness",
    name: "Health & Wellness",
    skills: [
      "Personal Training",
      "Life Coaching",
      "Nutrition Counseling",
      "Yoga Instruction",
      "Meditation Guidance",
      "Massage Therapy",
      "Physical Therapy",
      "Mental Health Support",
      "Fitness Classes",
      "Wellness Coaching",
      "Stress Management",
      "Sleep Coaching",
      "Mindfulness Training",
      "Holistic Health",
      "Alternative Medicine"
    ]
  },
  {
    id: "architecture",
    name: "Architecture & Design",
    skills: [
      "Architectural Design",
      "Building Plans",
      "Structural Engineering",
      "Interior Architecture",
      "3D Modeling",
      "Site Planning",
      "Building Codes",
      "Sustainable Design",
      "Commercial Architecture",
      "Residential Architecture",
      "Renovation Design",
      "Space Planning",
      "Material Selection",
      "Construction Documentation",
      "Project Management"
    ]
  },
  {
    id: "surveying",
    name: "Surveying & Engineering",
    skills: [
      "Land Surveying",
      "Property Boundaries",
      "Topographic Surveys",
      "Construction Surveying",
      "GPS Surveying",
      "Aerial Surveying",
      "Civil Engineering",
      "Structural Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Geotechnical Engineering",
      "Environmental Engineering",
      "Transportation Engineering",
      "Water Resources Engineering",
      "Construction Engineering"
    ]
  },
  {
    id: "automotive",
    name: "Automotive & Mechanical",
    skills: [
      "Auto Repair",
      "Engine Repair",
      "Brake Service",
      "Oil Change",
      "Diagnostic Testing",
      "Transmission Repair",
      "Electrical Systems",
      "AC/Heating Repair",
      "Tire Service",
      "Wheel Alignment",
      "Exhaust Repair",
      "Fuel System Repair",
      "Suspension Repair",
      "Body Work",
      "Paint & Refinishing"
    ]
  },
  {
    id: "welding",
    name: "Welding & Metalwork",
    skills: [
      "Arc Welding",
      "MIG Welding",
      "TIG Welding",
      "Stick Welding",
      "Plasma Cutting",
      "Metal Fabrication",
      "Steel Work",
      "Aluminum Welding",
      "Stainless Steel Welding",
      "Pipe Welding",
      "Structural Welding",
      "Sheet Metal Work",
      "Metal Art",
      "Welding Repair",
      "Custom Metal Projects"
    ]
  },
  {
    id: "construction",
    name: "Construction & Trades",
    skills: [
      "General Contracting",
      "Carpentry",
      "Masonry",
      "Concrete Work",
      "Steel Erection",
      "Roofing",
      "Siding Installation",
      "Foundation Work",
      "Framing",
      "Drywall Installation",
      "Flooring Installation",
      "Painting",
      "Electrical Work",
      "Plumbing",
      "HVAC Installation"
    ]
  },
  {
    id: "specialized",
    name: "Specialized Services",
    skills: [
      "Glass Installation",
      "Mirror Installation",
      "Window Installation",
      "Door Installation",
      "Security Systems",
      "Home Automation",
      "Solar Installation",
      "Generator Installation",
      "Water Filtration",
      "Air Purification",
      "Soundproofing",
      "Insulation",
      "Fire Safety",
      "Accessibility Modifications",
      "Emergency Repairs"
    ]
  }
];

export const getAllSkills = (): string[] => {
  return skillCategories.flatMap(category => category.skills);
};

export const getSkillsByCategory = (categoryId: string): string[] => {
  const category = skillCategories.find(cat => cat.id === categoryId);
  return category ? category.skills : [];
};

export const getCategoryName = (categoryId: string): string => {
  const category = skillCategories.find(cat => cat.id === categoryId);
  return category ? category.name : '';
};
