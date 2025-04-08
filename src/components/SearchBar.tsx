
import { useState, useEffect, useRef } from 'react';
import { Search, X, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SearchBarProps {
  creators: any[];
  onSelectCreator: (creator: any) => void;
}

const SearchBar = ({ creators, onSelectCreator }: SearchBarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const filteredResults = creators.filter(creator => 
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.bio && creator.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setSearchResults(filteredResults);
  }, [searchQuery, creators]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already filtering in real-time
  };
  
  const handleClear = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };
  
  const handleSelect = (creator: any) => {
    onSelectCreator(creator);
    handleClear();
  };
  
  return (
    <div className="relative">
      {isSearchOpen ? (
        <form onSubmit={handleSearch} className="relative">
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators..."
            className="w-full pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {searchResults.map(creator => (
                <div 
                  key={creator.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelect(creator)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={creator.profilePic} alt={creator.name} />
                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{creator.name}</div>
                    {creator.bio && (
                      <div className="text-xs text-gray-500 line-clamp-1">{creator.bio}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
              No creators found matching "{searchQuery}"
            </div>
          )}
        </form>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          title="Search creators"
        >
          <Search className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
