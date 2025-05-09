export interface FlightInfo {
  id: string;
  airlineName: string;
  departureTime: string; 
  arrivalTime: string;   
  originAirport: string;
  destinationAirport: string;
}

export interface Flight {
id: string;
nonStop: boolean;
price: number;
flightInformation: FlightInfo[];
}

export interface FlightPagination {
page: number;
limit: number;
total: number;
totalPages: number;
}

export interface ListFlightsResponse {
flights: Flight[];
pagination: FlightPagination;
}