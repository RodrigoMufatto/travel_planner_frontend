export interface Destination {
  id: string;
  city: string;
  state: string;
  country: string;
  startDate: string;
  endDate: string;
}

export  interface Trip {
  id: string;
  title: string;
  destinations: Destination[];
}

export  interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TripListResponse {
  trips: Trip[];
  pagination: Pagination;
}