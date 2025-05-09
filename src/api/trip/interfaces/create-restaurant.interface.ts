export interface RestaurantAddress {
  city: string;
  state: string;
  country: string;
  number?: string;
  neighborhood?: string;
  street: string;
  zipcode?: string;
}

export interface CreateRestaurantPayload {
  destinationId: string;
  name: string;
  rating: string;
  priceLevel: number;
  address: RestaurantAddress;
}