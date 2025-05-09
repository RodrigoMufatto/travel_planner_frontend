export interface CreateActivityLocation {
  city: string;
  state?: string;
  country: string;
  number?: string;
  neighborhood?: string;
  street?: string;
  zipcode?: string;
}

export interface CreateActivityPayload {
  destinationId: string;
  title: string;
  description: string;
  startDate: string; 
  endDate: string;   
  location: CreateActivityLocation;
  cost?: number;
}
