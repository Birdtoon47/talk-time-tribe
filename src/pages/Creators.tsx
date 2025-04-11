import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Filter, Clock, DollarSign, Search } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { safeGetItem } from '@/utils/storage';
import PageHeader from '@/components/navigation/PageHeader';
import BottomNav from '@/components/navigation/BottomNav';
import { formatCurrency } from '@/utils/formatters';

const Creators = () => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<any[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    consultationType: 'all',
    rating: 0,
    availability: 'all'
  });
  const [sortBy, setSortBy] = useState('popular');
  const [currentTab, setCurrentTab] = useState('all');
  
  // Load creators on mount
  useEffect(() => {
    // In a real app, this would be an API call
    const storedUsers = safeGetItem('talktribe_users', []);
    const creatorsList = storedUsers.filter((user: any) => user.isCreator);
    
    // If no creators found in storage, generate some sample data
    const sampleCreators = creatorsList.length > 0 ? creatorsList : generateSampleCreators();
    
    setCreators(sampleCreators);
    setFilteredCreators(sampleCreators);
  }, []);
  
  // Filter creators when filters change
  useEffect(() => {
    let result = [...creators];
    
    // Apply category filter
    if (currentTab !== 'all') {
      result = result.filter(creator => 
        creator.categories && creator.categories.includes(currentTab)
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(creator => 
        creator.name.toLowerCase().includes(term) || 
        (creator.bio && creator.bio.toLowerCase().includes(term))
      );
    }
    
    // Apply price range filter
    result = result.filter(creator => 
      creator.ratePerMinute >= filters.priceRange[0] && 
      creator.ratePerMinute <= filters.priceRange[1]
    );
    
    // Apply consultation type filter
    if (filters.consultationType !== 'all') {
      result = result.filter(creator => {
        if (!creator.services) return true;
        return creator.services.some((service: any) => 
          service.type === filters.consultationType
        );
      });
    }
    
    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter(creator => 
        (creator.ratings || 5.0) >= filters.rating
      );
    }
    
    // Apply sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.ratePerMinute - b.ratePerMinute);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.ratePerMinute - a.ratePerMinute);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.ratings || 5.0) - (a.ratings || 5.0));
    } else {
      // Default: sort by popularity (consultation count)
      result.sort((a, b) => (b.totalConsults || 0) - (a.totalConsults || 0));
    }
    
    setFilteredCreators(result);
  }, [creators, searchTerm, filters, sortBy, currentTab]);
  
  const handleViewProfile = (creator: any) => {
    // Store selected creator in session storage for the profile page
    sessionStorage.setItem('selected_creator', JSON.stringify(creator));
    navigate('/creator-profile');
  };
  
  const generateSampleCreators = () => {
    // Generate sample creators with different specialties
    const categories = [
      'Business', 'Technology', 'Health', 'Education', 
      'Finance', 'Career', 'Relationships', 'Art'
    ];
    
    const sampleProfiles = [
      {
        id: '1',
        name: 'Sarah Johnson',
        profilePic: 'https://randomuser.me/api/portraits/women/44.jpg',
        bio: 'Business strategy consultant with 15+ years experience helping startups scale.',
        ratePerMinute: 8000,
        ratings: 4.9,
        totalConsults: 148,
        categories: ['Business', 'Career', 'Finance'],
        isCreator: true,
        available: true
      },
      {
        id: '2',
        name: 'Michael Chen',
        profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: 'Tech startup advisor and software architect specializing in AI solutions.',
        ratePerMinute: 10000,
        ratings: 5.0,
        totalConsults: 97,
        categories: ['Technology', 'Business', 'Education'],
        isCreator: true,
        available: true
      },
      {
        id: '3',
        name: 'Dr. Amara Patel',
        profilePic: 'https://randomuser.me/api/portraits/women/65.jpg',
        bio: 'Clinical psychologist focused on stress management and workplace wellness.',
        ratePerMinute: 12000,
        ratings: 4.8,
        totalConsults: 215,
        categories: ['Health', 'Relationships', 'Career'],
        isCreator: true,
        available: false
      },
      {
        id: '4',
        name: 'Robert Kim',
        profilePic: 'https://randomuser.me/api/portraits/men/15.jpg',
        bio: 'Financial advisor specializing in personal investment strategies and retirement planning.',
        ratePerMinute: 7500,
        ratings: 4.7,
        totalConsults: 132,
        categories: ['Finance', 'Business', 'Education'],
        isCreator: true,
        available: true
      },
      {
        id: '5',
        name: 'Elena Gonzalez',
        profilePic: 'https://randomuser.me/api/portraits/women/28.jpg',
        bio: 'Career transition coach helping professionals find fulfilling career paths.',
        ratePerMinute: 6000,
        ratings: 4.9,
        totalConsults: 183,
        categories: ['Career', 'Education', 'Relationships'],
        isCreator: true,
        available: true
      },
      {
        id: '6',
        name: 'James Wilson',
        profilePic: 'https://randomuser.me/api/portraits/men/54.jpg',
        bio: 'UX/UI design consultant with experience at top tech companies.',
        ratePerMinute: 9000,
        ratings: 4.6,
        totalConsults: 79,
        categories: ['Technology', 'Art', 'Business'],
        isCreator: true,
        available: false
      }
    ];
    
    // Store sample creators
    safeGetItem('talktribe_users', sampleProfiles);
    
    return sampleProfiles;
  };
  
  

  return (
    <div className="container mx-auto pb-20">
      <PageHeader title="Find Expert Consultants" showBackButton={false} />
      
      <div className="p-4">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, specialty, or keywords..."
                className="pl-10"
              />
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-gray-100" : ""}
            >
              <Filter size={18} />
            </Button>
          </div>
          
          {showFilters && (
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range (per minute)</label>
                  <Slider
                    defaultValue={[0, 50000]}
                    max={50000}
                    step={1000}
                    onValueChange={(value) => setFilters({...filters, priceRange: value})}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatCurrency(filters.priceRange[0])}</span>
                    <span>{formatCurrency(filters.priceRange[1])}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consultation Type</label>
                  <Select
                    defaultValue="all"
                    onValueChange={(value) => setFilters({...filters, consultationType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="text">Text Chat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Rating</label>
                  <Select 
                    defaultValue="0"
                    onValueChange={(value) => setFilters({...filters, rating: parseFloat(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 50000],
                      consultationType: 'all',
                      rating: 0,
                      availability: 'all'
                    });
                    setSearchTerm('');
                  }}
                >
                  Reset Filters
                </Button>
                
                <Select
                  defaultValue="popular"
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by Popular" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Sort by Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          )}
        </div>
        
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="mb-6">
          <TabsList className="flex overflow-x-auto pb-2 mb-2 space-x-2">
            <TabsTrigger value="all">All Categories</TabsTrigger>
            <TabsTrigger value="Business">Business</TabsTrigger>
            <TabsTrigger value="Technology">Technology</TabsTrigger>
            <TabsTrigger value="Health">Health</TabsTrigger>
            <TabsTrigger value="Finance">Finance</TabsTrigger>
            <TabsTrigger value="Career">Career</TabsTrigger>
            <TabsTrigger value="Education">Education</TabsTrigger>
            <TabsTrigger value="Relationships">Relationships</TabsTrigger>
            <TabsTrigger value="Art">Art</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <CreatorsList 
              creators={filteredCreators} 
              formatCurrency={formatCurrency}
              onViewProfile={handleViewProfile}
            />
          </TabsContent>
          
          {['Business', 'Technology', 'Health', 'Finance', 'Career', 'Education', 'Relationships', 'Art'].map(category => (
            <TabsContent key={category} value={category} className="mt-4">
              <CreatorsList 
                creators={filteredCreators} 
                formatCurrency={formatCurrency}
                onViewProfile={handleViewProfile}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
};

interface CreatorsListProps {
  creators: any[];
  formatCurrency: (amount: number) => string;
  onViewProfile: (creator: any) => void;
}

const CreatorsList = ({ creators, formatCurrency, onViewProfile }: CreatorsListProps) => {
  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No consultants found that match your criteria.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search term.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {creators.map(creator => (
        <Card key={creator.id} className="overflow-hidden h-full flex flex-col">
          <div className="p-4 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-3">
                  {creator.profilePic ? (
                    <img src={creator.profilePic} alt={creator.name} />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      {creator.name.charAt(0)}
                    </div>
                  )}
                </Avatar>
                
                <div>
                  <h3 className="font-medium">{creator.name}</h3>
                  <div className="flex items-center text-yellow-500 mt-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="ml-1 text-xs">
                      {creator.ratings || '5.0'} ({creator.totalConsults || '0'})
                    </span>
                  </div>
                </div>
              </div>
              
              <Badge variant={creator.available ? "default" : "outline"} className={creator.available ? "bg-green-500" : ""}>
                {creator.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {creator.bio || 'No bio available.'}
            </p>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {creator.categories?.map((category: string) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                <span className="font-medium">
                  {formatCurrency(creator.ratePerMinute)} <span className="text-xs font-normal">/min</span>
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span>{creator.totalConsults || 0} consultations</span>
              </div>
            </div>
          </div>
          
          <div className="px-4 pb-4 mt-auto">
            <Button
              onClick={() => onViewProfile(creator)}
              className="w-full bg-app-purple hover:bg-purple-700"
            >
              View Profile
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Creators;
