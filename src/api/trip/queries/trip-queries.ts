import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActivity, createFlight, createHotel, createRestaurant, createTrip, deleteFlightById, deleteHotelById, deleteRestaurantById, getActivitiesByDestinationId, getFlightsByDestinationId, getHotelsByDestinationId, getRestaurantsByDestinationId, getTripById, getTripsByUserId } from "../service/trip-services";
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

export const useTrips = (
  userId: string | null,
  token: string | null,
  title: string = "",
  page: number = 1,
  limit: number = 9
) => {
  return useQuery<TripListResponse>({
    queryKey: ["trips", userId, title, page],
    queryFn: () => getTripsByUserId(userId!, token!, title, page, limit),
    enabled: !!userId && !!token,
  });
};

export const useCreateTrip = (token: string, userId: string) => {
  return useMutation({
    mutationFn: (tripData: Omit<CreateTripInput, "userTrips">) =>
      createTrip(
        {
          ...tripData,
          userTrips: { userId },
        },
        token
      ),
  });
};

export const useTripById = (tripId: string | null, token: string | null) => {
  return useQuery<Trip>({
    queryKey: ["trip", tripId],
    queryFn: () => getTripById(tripId!, token!),
    enabled: !!tripId && !!token,
  });
};

export const useCreateActivity = (token: string) => {
  return useMutation({
    mutationFn: (activityData: CreateActivityPayload) =>
      createActivity(activityData, token),
  });
};

export const useActivitiesByDestination = (
  destinationId: string | null,
  token: string | null,
  page: number = 1,
  limit: number = 9
) => {
  return useQuery<ActivityListResponse>({
    queryKey: ["activities-by-destination", destinationId, page],
    queryFn: () => getActivitiesByDestinationId(destinationId!, token!, page, limit),
    enabled: !!destinationId && !!token,
  });
};

export const useCreateHotel = (token: string) => {
  return useMutation({
    mutationFn: (hotelData: CreateHotelPayload) => createHotel(hotelData, token),
  });
};

export const useHotelsByDestination = (
  destinationId: string | null,
  token: string | null,
  page: number = 1,
  limit: number = 4
) => {
  return useQuery<HotelListResponse>({
    queryKey: ["hotels-by-destination", destinationId, page],
    queryFn: () => getHotelsByDestinationId(destinationId!, token!, page, limit),
    enabled: !!destinationId && !!token,
  });
};

export const useDeleteHotel = (token: string, destinationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hotelId: string) => deleteHotelById(hotelId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hotels-by-destination", destinationId],
      });
    },
  });
};

export const useCreateRestaurant = (token: string) => {
  return useMutation({
    mutationFn: (restaurantData: CreateRestaurantPayload) =>
      createRestaurant(restaurantData, token),
  });
};

export const useRestaurantsByDestination = (
  destinationId: string | null,
  token: string | null,
  page: number = 1,
  limit: number = 4
) => {
  return useQuery<RestaurantListResponse>({
    queryKey: ["restaurants-by-destination", destinationId, page],
    queryFn: () => getRestaurantsByDestinationId(destinationId!, token!, page, limit),
    enabled: !!destinationId && !!token,
  });
};

export const useDeleteRestaurant = (token: string, destinationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (restaurantId: string) => deleteRestaurantById(restaurantId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["restaurants-by-destination", destinationId],
      });
    },
  });
};

export const useCreateFlight = (token: string) => {
  return useMutation({
    mutationFn: (flightData: CreateFlightPayload) => createFlight(flightData, token),
  });
};

export const useFlightsByDestination = (
  destinationId: string | null,
  token: string | null,
  page: number = 1,
  limit: number = 4
) => {
  return useQuery<ListFlightsResponse>({
    queryKey: ["flights-by-destination", destinationId, page],
    queryFn: () => getFlightsByDestinationId(destinationId!, token!, page, limit),
    enabled: !!destinationId && !!token,
  });
};

export const useDeleteFlight = (token: string, destinationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flightId: string) => deleteFlightById(flightId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["flights-by-destination", destinationId],
      });
    },
  });
};