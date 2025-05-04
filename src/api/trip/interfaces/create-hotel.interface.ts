export interface HotelAddress {
  city: string;
  state: string;
  country: string;
  number?: string;
  neighborhood?: string;
  street: string;
  zipcode?: string;
}

export interface CreateHotelPayload {
  destinationId: string;
  name: string;
  rating: string;
  address: HotelAddress;
}