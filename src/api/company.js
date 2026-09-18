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
