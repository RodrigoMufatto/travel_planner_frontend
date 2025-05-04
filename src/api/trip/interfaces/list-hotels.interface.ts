export interface HotelAddress {
  city: string;
  state: string;
  country: string;
  neighborhood?: string;
  number?: string;
  zipcode?: string;
  street: string;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  address: HotelAddress;
}

export interface HotelPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HotelListResponse {
  hotel: Hotel[];
  pagination: HotelPagination;
}