import apiClient from "./apiClient";

export const categoryApi = {
    getAllCategories: () => apiClient.get("/categories"),
    getCategory: (id) => apiClient.get(`/categories/${id}`),
    createCategory: (data) => apiClient.post("/categories", data),
    updateCategory: (id, data) => apiClient.put(`/categories/${id}`, data),
    deleteCategory: (id) => apiClient.delete(`/categories/${id}`)
}