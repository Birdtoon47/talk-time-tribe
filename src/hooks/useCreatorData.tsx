
import { useState, useEffect } from 'react';
import { safeSetItem, safeGetItem } from '@/utils/storage';

const useCreatorData = (userData: any) => {
  const [creators, setCreators] = useState<any[]>([]);

  useEffect(() => {
    // Load mock creators data
    const mockCreators = [
      {
        id: '1',
        name: 'Sarah Johnson',
        profilePic: 'https://i.pravatar.cc/150?img=1',
        bio: 'Tech influencer & software developer. Book consultations for career advice!',
        ratePerMinute: 5000,
        minuteIncrement: 5,
        ratings: 4.8,
        totalConsults: 124
      },
      {
        id: '2',
        name: 'Mike Williams',
        profilePic: 'https://i.pravatar.cc/150?img=3',
        bio: 'Financial advisor & investment specialist. Get your money questions answered!',
        ratePerMinute: 7500,
        minuteIncrement: 10,
        ratings: 4.9,
        totalConsults: 78
      },
      {
        id: '3',
        name: 'Jessica Lee',
        profilePic: 'https://i.pravatar.cc/150?img=5',
        bio: 'Fitness coach & nutrition expert. Book a session to discuss your health goals!',
        ratePerMinute: 4000,
        minuteIncrement: 15,
        ratings: 4.7,
        totalConsults: 215
      }
    ];
    
    // Use our safe storage utility to get creators
    const storedCreators = safeGetItem('talktribe_creators', []);
    let allCreators = storedCreators.length > 0 ? storedCreators : mockCreators;
    
    if (userData.isCreator) {
      // Check if the current user already exists in the creators list
      const existingCreatorIndex = allCreators.findIndex((c: any) => c.id === userData.id);
      
      if (existingCreatorIndex !== -1) {
        // Update the existing creator entry
        allCreators[existingCreatorIndex] = {
          id: userData.id,
          name: userData.name,
          profilePic: userData.profilePic,
          bio: userData.bio || 'Your personal bio goes here. Edit your profile to update it!',
          ratePerMinute: userData.ratePerMinute || 5000,
          minuteIncrement: userData.minuteIncrement || 5,
          ratings: userData.ratings || 5.0,
          totalConsults: userData.totalConsults || 0
        };
      } else {
        // Add the current user as a creator
        allCreators.push({
          id: userData.id,
          name: userData.name,
          profilePic: userData.profilePic,
          bio: userData.bio || 'Your personal bio goes here. Edit your profile to update it!',
          ratePerMinute: userData.ratePerMinute || 5000,
          minuteIncrement: userData.minuteIncrement || 5,
          ratings: 5.0,
          totalConsults: 0
        });
      }
      
      // Save the updated creators list using our safe storage utility
      safeSetItem('talktribe_creators', allCreators);
    }
    
    setCreators(allCreators);
  }, [userData]);

  const updateCreatorsList = (updatedUserData: any) => {
    if (updatedUserData.isCreator) {
      setCreators(prev => {
        const updatedCreators = [...prev];
        const index = updatedCreators.findIndex(c => c.id === updatedUserData.id);
        
        if (index !== -1) {
          updatedCreators[index] = {
            ...updatedCreators[index],
            name: updatedUserData.name,
            profilePic: updatedUserData.profilePic,
            bio: updatedUserData.bio,
            ratePerMinute: updatedUserData.ratePerMinute,
            minuteIncrement: updatedUserData.minuteIncrement
          };
        }
        
        // Save with safe utility
        safeSetItem('talktribe_creators', updatedCreators);
        return updatedCreators;
      });
    }
  };

  return { creators, updateCreatorsList };
};

export default useCreatorData;
