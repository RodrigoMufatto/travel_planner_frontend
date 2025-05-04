export interface TripDestination {
  id: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  latitude?: string;
  longitude?: string;
  state?: string;
  placeId?: string;
}

export interface Trip {
  id: string;
  title: string;
  destinations: TripDestination[];
}