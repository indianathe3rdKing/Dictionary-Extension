import axios from "axios";

const API_BASE_URL = "https://r1qrdf98db.execute-api.eu-north-1.amazonaws.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userApi = {
  createUser: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  },

  //Get user for login
  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error("Login failed");
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
