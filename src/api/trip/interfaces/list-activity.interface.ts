export interface ActivityAddress {
  city: string;
  state: string;
  country: string;
  neighborhood?: string;
  number?: string;
  zipcode?: string;
  street: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  cost: number;
  addressId: string;
  address: ActivityAddress;
}

export interface ActivityPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ActivityListResponse {
  activity: Activity[];
  pagination: ActivityPagination;
}