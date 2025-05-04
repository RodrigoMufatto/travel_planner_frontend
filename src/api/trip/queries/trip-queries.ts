import { useMutation, useQuery } from "@tanstack/react-query";
import { createActivity, createHotel, createTrip, getActivitiesByDestinationId, getTripsByUserId } from "../service/trip-services";

export const useTrips = (
  userId: string | null,
  token: string | null,
  title: string = "",
  page: number = 1,
  limit: number = 9
) => {
  return useQuery({
    queryKey: ["trips", userId, title, page],
    queryFn: () => getTripsByUserId(userId!, token!, title, page, limit),
    enabled: !!userId && !!token,
  });
};

export const useCreateTrip = (token: string, userId: string) => {
  return useMutation({
    mutationFn: (tripData: any) =>
      createTrip(
        {
          ...tripData,
          userTrips: { userId },
        },
        token
      ),
  });
};

import { getTripById } from "../service/trip-services";

export const useTripById = (tripId: string | null, token: string | null) => {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getTripById(tripId!, token!),
    enabled: !!tripId && !!token,
  });
};

export const useCreateActivity = (token: string) => {
  return useMutation({
    mutationFn: (activityData: any) => createActivity(activityData, token),
  });
};

export const useActivitiesByDestination = (
  destinationId: string | null,
  token: string | null,
  page: number = 1,
  limit: number = 9
) => {
  return useQuery({
    queryKey: ["activities-by-destination", destinationId, page],
    queryFn: () => getActivitiesByDestinationId(destinationId!, token!, page, limit),
    enabled: !!destinationId && !!token,
  });
};

export const useCreateHotel = (token: string) => {
  return useMutation({
    mutationFn: (hotelData: any) => createHotel(hotelData, token),
  });
};