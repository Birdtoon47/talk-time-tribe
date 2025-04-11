
import { safeGetItem, safeSetItem } from '@/utils/storage';
import { Service } from '@/types/creator';
import { toast } from 'sonner';

/**
 * Loads services for a specific creator
 * @param creatorId The creator's ID
 * @returns Array of services
 */
export const loadCreatorServices = (creatorId: string): Service[] => {
  return safeGetItem(`talktribe_services_${creatorId}`, []);
};

/**
 * Saves a service for a creator
 * @param service The service to save
 * @returns The updated services array
 */
export const saveCreatorService = (service: Service): Service[] => {
  const creatorId = service.creatorId;
  const services = loadCreatorServices(creatorId);
  
  const updatedServices = [service, ...services];
  safeSetItem(`talktribe_services_${creatorId}`, updatedServices);
  
  toast.success('Service created successfully');
  
  return updatedServices;
};

/**
 * Deletes a service
 * @param creatorId The creator's ID
 * @param serviceId The service's ID
 * @returns The updated services array
 */
export const deleteCreatorService = (creatorId: string, serviceId: string): Service[] => {
  const services = loadCreatorServices(creatorId);
  const updatedServices = services.filter(service => service.id !== serviceId);
  
  safeSetItem(`talktribe_services_${creatorId}`, updatedServices);
  
  toast.success('Service deleted');
  
  return updatedServices;
};
