import api from "../../api";

export const authService = {
    register: async (userData: any) => {
        const response = await api.post("/auth/signup", userData);
        return response.data;
    },
};