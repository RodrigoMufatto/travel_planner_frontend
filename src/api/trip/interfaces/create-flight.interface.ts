export interface FlightSegment {
  airlineName: string;
  carrierCodeAirline: string;
  originAirport: string;
  destinationAirport: string;
  departureDate: string; 
  departureTime: string; 
  arrivalDate: string;   
  arrivalTime: string;   
  order: number;
}

export interface CreateFlightPayload {
  destinationId: string;
  stopNumber: number;
  nonStop: boolean;
  duration: string;
  price: number;
  flights: FlightSegment[];
}