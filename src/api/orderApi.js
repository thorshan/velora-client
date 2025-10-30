import apiClient from "./apiClient";

export const orderApi = {
    getAllOrders: () => apiClient.get("/orders"),
    getOrder: (id) => apiClient.get(`/orders/${id}`),
    getOrderByUser: (id) => apiClient.get(`/orders/order/${id}`),
    createOrder: (data) => apiClient.post("/orders", data),
    updateOrder: (id, data) => apiClient.put(`/orders/${id}`, data),
    deleteOrder: (id) => apiClient.delete(`/orders/${id}`)
}