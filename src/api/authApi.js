import apiClient from "./apiClient";

export const authApi = {
	login: (data) => apiClient.post("/login", data),
    register: (data) => apiClient.post("/register", data),
    logout: () => apiClient.post("/logout")
}