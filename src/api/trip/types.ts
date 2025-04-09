export interface Trip {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    destinations: {
      id: string;
      city: string;
      state: string;
      country: string;
    }[];
  }
  
  export interface TripParams {
    page?: number;
    limit?: number;
    title?: string;
    startDate?: string;
    endDate?: string;
  }