import apiClient from "./apiClient";

export const reviewApi = {
    getAllReviews: () => apiClient.get("/reviews"),
    getReview: (id) => apiClient.get(`/reviews/${id}`),
    getReviewByItem: (id) => apiClient.get(`/reviews/review-item/${id}`),
    getReviewByUser: (id) => apiClient.get(`/reviews/user/${id}`),
    createReview: (data) => apiClient.post("/reviews", data),
    deleteReview: (id) => apiClient.delete(`/reviews/${id}`)
}