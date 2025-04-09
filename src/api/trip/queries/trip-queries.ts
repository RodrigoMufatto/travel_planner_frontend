import { useMutation, useQuery } from "@tanstack/react-query";
import { createTrip, getTripsByUserId } from "../service/trip-services";

export const useTrips = (
  userId: string | null,
  token: string | null,
  title: string = ""
) => {
  return useQuery({
    queryKey: ["trips", userId, title],
    queryFn: () => getTripsByUserId(userId!, token!, title),
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