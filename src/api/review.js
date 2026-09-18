import axiosClient from "./axiosClient";

// POST /comment/create — { subject, review, rating, userId, companyId }
export const createReview = (payload) =>
  axiosClient.post("/comment/create", payload);

// GET /comment/list
export const getReviewList = () => axiosClient.get("/comment/list");

// PATCH /comment/update/:id
export const updateReview = (id, payload) =>
  axiosClient.patch(`/comment/update/${id}`, payload);

// DELETE /comment/delete/:id
export const deleteReview = (id) => axiosClient.delete(`/comment/delete/${id}`);
