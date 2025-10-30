import apiClient from "./apiClient";

export const brandApi = {
    getAllBrands: () => apiClient.get("/brands"),
    getBrand: (id) => apiClient.get(`/brands/${id}`),
    createBrand: (data) => apiClient.post("/brands", data),
    updateBrand: (id, data) => apiClient.put(`/brands/${id}`, data),
    deleteBrand: (id) => apiClient.delete(`/brands/${id}`)
}