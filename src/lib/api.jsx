const { default: axios } = require("axios");

const API_BASE_URL = "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userApi = {
  createUser: async (userData) => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  },
  //Get user by id
  getUser: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      if (
        response.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
      ) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },

  // Update user by id
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);

      return response.data;
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  },
  //Delete user by id
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },
};
