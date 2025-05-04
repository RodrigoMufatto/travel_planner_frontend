export interface CreateTripInput {
  title: string;
  userTrips: {
    userId: string;
  };
  destination: CreateDestinationInput[];
}

export interface CreateDestinationInput {
  city: string;
  startDate: string;
  endDate: string;
  state?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
  placeId?: string;
}