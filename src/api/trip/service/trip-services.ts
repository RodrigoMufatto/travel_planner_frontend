import api from "@/api/api";

export const getTripsByUserId = async (
  userId: string,
  token: string,
  title: string = ""
) => {
  const response = await api.get(`/trip/list/${userId}`, {
    params: {
      page: 1,
      limit: 9,
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