import apiClient from "./apiClient";

export const cartApi = {
    getCart: (userId) => apiClient.get(`/cart/${userId}`),
    addToCart: (data) => apiClient.post("/cart/add", data),
    updateQuantity: (data) => apiClient.put("/cart/update", data),
    removeFromCart: (data) => apiClient.delete("/cart/remove", {data}),
    clearCart: (userId) => apiClient.delete(`/cart/clear/${userId}`)
}