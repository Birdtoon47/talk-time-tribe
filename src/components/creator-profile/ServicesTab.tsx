
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Video, MessageSquare, Calendar, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Service } from '@/types/creator';

interface ServicesTabProps {
  userData: any;
  isOwnProfile: boolean;
  services: any[];
  handleDeleteService: (serviceId: string) => void;
  onBookConsultation?: (creatorData: any) => void;
  formatCurrency: (amount: number) => string;
}

const ServicesTab = ({
  userData,
  isOwnProfile,
  services,
  handleDeleteService,
  onBookConsultation,
  formatCurrency
}: ServicesTabProps) => {
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: 30,
    price: userData.ratePerMinute ? userData.ratePerMinute * 30 : 150000
  });

  const handleCreateService = () => {
    if (!newService.title || !newService.description) {
      return;
    }
    
    const service = {
      id: Date.now().toString(),
      creatorId: userData.id,
      title: newService.title,
      description: newService.description,
      type: newService.type,
      duration: newService.duration,
      price: newService.price,
      createdAt: Date.now()
    };
    
    // Reset the form
    setNewService({
      title: '',
      description: '',
      type: 'video',
      duration: 30,
      price: userData.ratePerMinute ? userData.ratePerMinute * 30 : 150000
    });
    
    setIsCreateServiceOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Consultation Services</h3>
        <Button 
          onClick={() => setIsCreateServiceOpen(true)}
          className="bg-app-purple"
        >
          Create New Service
        </Button>
      </div>
      
      {services.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500 mb-4">You haven't created any consultation services yet</p>
          <Button 
            onClick={() => setIsCreateServiceOpen(true)}
            className="bg-app-purple"
          >
            Create Your First Service
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between">
                  <h4 className="font-medium text-lg">{service.title}</h4>
                  {isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center">
                    {service.type === 'video' ? (
                      <Video className="h-3 w-3 mr-1" />
                    ) : service.type === 'audio' ? (
                      <MessageSquare className="h-3 w-3 mr-1" />
                    ) : (
                      <Calendar className="h-3 w-3 mr-1" />
                    )}
                    {service.type.charAt(0).toUpperCase() + service.type.slice(1)} Call
                  </div>
                  <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duration} minutes
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-bold text-app-purple">
                    {formatCurrency(service.price)}
                  </p>
                  
                  {!isOwnProfile && onBookConsultation && (
                    <Button
                      size="sm"
                      className="bg-app-purple"
                      onClick={() => onBookConsultation({...userData, selectedService: service})}
                    >
                      Book Now
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateServiceOpen} onOpenChange={setIsCreateServiceOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Consultation Service</DialogTitle>
            <DialogDescription>
              Define your consultation offering to attract clients.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title *</Label>
              <Input 
                id="title" 
                placeholder="e.g., Career Coaching Session"
                value={newService.title}
                onChange={(e) => setNewService({...newService, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Describe what clients will get from this consultation..."
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Consultation Type</Label>
              <RadioGroup 
                value={newService.type} 
                onValueChange={(value) => setNewService({...newService, type: value})}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center">
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="audio" id="audio" />
                  <Label htmlFor="audio" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Audio
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Text Chat
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration" 
                type="number"
                min="5"
                step="5"
                value={newService.duration}
                onChange={(e) => {
                  const duration = parseInt(e.target.value, 10);
                  const price = userData.ratePerMinute * duration;
                  setNewService({...newService, duration, price});
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price" 
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({...newService, price: parseInt(e.target.value, 10)})}
              />
              <p className="text-xs text-gray-500">
                {formatCurrency(newService.price)} for {newService.duration} minutes
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              className="bg-app-purple" 
              onClick={handleCreateService}
              disabled={!newService.title || !newService.description}
            >
              Create Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesTab;
