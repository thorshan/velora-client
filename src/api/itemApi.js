import apiClient from "./apiClient";

export const itemApi = {
    getAllItems: () => apiClient.get("/items"),
    getItem: (id) => apiClient.get(`/items/${id}`),
    getItemWithAllData: (id) => apiClient.get(`/items/${id}`),
    getItemByUser: (id) => apiClient.get(`/items/user/${id}`),
    createItem: (data) => apiClient.post("/items", data),
    updateItem: (id, data) => apiClient.put(`/items/${id}`, data),
    deleteItem: (id) => apiClient.delete(`/items/${id}`)
}