import api from "@/api/api";

export const getTripsByUserId = async (
  userId: string,
  token: string,
  title: string = "",
  page: number = 1,
  limit: number = 9
) => {
  const response = await api.get(`/trip/list/${userId}`, {
    params: {
      page,
      limit,
      title,
    },
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

export const createTrip = async (tripData: any, token: string) => {
  const response = await api.post("/trip/create", tripData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getTripById = async (tripId: string, token: string) => {
  const response = await api.get(`/trip/${tripId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createActivity = async (activityData: any, token: string) => {
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
) => {
  const response = await api.get(`/activity/list/${destinationId}`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createHotel = async (hotelData: any, token: string) => {
  const response = await api.post("/hotel/create", hotelData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
