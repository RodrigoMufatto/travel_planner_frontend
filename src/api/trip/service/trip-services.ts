import api from "@/api/api";
import { TripListResponse } from "../interfaces/list-trip.interface";
import { CreateTripInput } from "../interfaces/create-trip.interface";
import { Trip } from "../interfaces/get-trip-by-id.interface";
import { CreateActivityPayload } from "../interfaces/create-activity.interface";
import { ActivityListResponse } from "../interfaces/list-activity.interface";
import { CreateHotelPayload } from "../interfaces/create-hotel.interface";
import { HotelListResponse } from "../interfaces/list-hotels.interface";
import { CreateRestaurantPayload } from "../interfaces/create-restaurant.interface";
import { RestaurantListResponse } from "../interfaces/list-restaurant.interface";
import { CreateFlightPayload } from "../interfaces/create-flight.interface";
import { ListFlightsResponse } from "../interfaces/list-flights.interface";

export const getTripsByUserId = async (
  userId: string,
  token: string,
  title: string = "",
  page: number = 1,
  limit: number = 9
): Promise<TripListResponse> => {
  const response = await api.get<TripListResponse>(`/trip/list/${userId}`, {
    params: { page, limit, title },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteTrip = async (tripId: string, token: string) => {
  const response = await api.delete(`/trip/delete/${tripId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createTrip = async (tripData: CreateTripInput, token: string) => {
  const response = await api.post("/trip/create", tripData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getTripById = async (tripId: string, token: string): Promise<Trip> => {
  const response = await api.get(`/trip/${tripId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createActivity = async (
  activityData: CreateActivityPayload,
  token: string
): Promise<any> => {
  const response = await api.post("/activity/create", activityData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getActivitiesByDestinationId = async (
  destinationId: string,
  token: string,
  page: number = 1,
  limit: number = 9
): Promise<ActivityListResponse> => {
  const response = await api.get(`/activity/list/${destinationId}`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createHotel = async (hotelData: CreateHotelPayload, token: string) => {
  const response = await api.post("/hotel/create", hotelData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getHotelsByDestinationId = async (
  destinationId: string,
  token: string,
  page: number = 1,
  limit: number = 4
): Promise<HotelListResponse> => {
  const response = await api.get(`/hotel/list/${destinationId}`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteHotelById = async (hotelId: string, token: string) => {
  await api.delete(`/hotel/delete/${hotelId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createRestaurant = async (data: CreateRestaurantPayload, token: string) => {
  const response = await api.post("/restaurant/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getRestaurantsByDestinationId = async (
  destinationId: string,
  token: string,
  page: number = 1,
  limit: number = 4
): Promise<RestaurantListResponse> => {
  const response = await api.get(`/restaurant/list/${destinationId}`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteRestaurantById = async (restaurantId: string, token: string) => {
  await api.delete(`/restaurant/delete/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createFlight = async (flightData: CreateFlightPayload, token: string) => {
  const response = await api.post("/flight/create", flightData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getFlightsByDestinationId = async (
  destinationId: string,
  token: string,
  page: number = 1,
  limit: number = 4
): Promise<ListFlightsResponse> => {
  const response = await api.get(`/flight/list/${destinationId}`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteFlightById = async (flightId: string, token: string) => {
  await api.delete(`/flight/delete/${flightId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};