import apiClient from "./apiClient";

export const userApi = {
    getAllUser: () => apiClient.get("/users"),
    getUser: (id) => apiClient.get(`/users/${id}`),
    createUser: (data) => apiClient.post("/users", data),
    updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
    deleteUser: (id) => apiClient.delete(`/users/${id}`)
}