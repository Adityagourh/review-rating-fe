import axiosClient from "./axiosClient";

// POST /company/create — requires auth, multipart/form-data (profilePic required)
export const createCompany = (formData) =>
  axiosClient.post("/company/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// GET /company/list
export const getCompanyList = () => axiosClient.get("/company/list");

// GET /company/review/:id -> { company, review[] }
export const getCompanyDetails = (id) =>
  axiosClient.get(`/company/review/${id}`);

// GET /company/searchcompany/:letters
export const searchCompaniesByLetters = (letters) =>
  axiosClient.get(`/company/searchcompany/${encodeURIComponent(letters)}`);

// PATCH /company/update/:id — admin only, multipart/form-data (profilePic optional)
export const updateCompany = (id, formData) =>
  axiosClient.patch(`/company/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// DELETE /company/delete/:id — admin only, also removes the company's reviews
export const deleteCompany = (id) => axiosClient.delete(`/company/delete/${id}`);
