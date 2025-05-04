export interface Address {
  city: string;
  state: string;
  country: string;
  neighborhood: string;
  number: string;
  zipcode: string;
  street: string;
}

export interface Restaurant {
  id: string;
  name: string;
  priceLevel: number;
  rating: number;
  address: Address;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RestaurantListResponse {
  restaurant: Restaurant[];
  pagination: Pagination;
}