import axiosClient from "./axiosClient";

// POST /user/create — multipart/form-data (profilePic file required by backend)
export const registerUser = (formData) =>
  axiosClient.post("/user/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// POST /user/login — { userEmail, userPassword } -> { token }
export const loginUser = (payload) => axiosClient.post("/user/login", payload);

// POST /user/sendlink — { userEmail } -> reset link emailed
export const sendResetLink = (payload) =>
  axiosClient.post("/user/sendlink", payload);

// GET /user/resetpassword/:id/:token  (body: newPassword, confirmPassword)
export const resetPassword = (id, token, payload) =>
  axiosClient.get(`/user/resetpassword/${id}/${token}`, { data: payload });

// GET /user/list — admin only
export const getUserList = () => axiosClient.get("/user/list");

// PATCH /user/role/:id — admin only, { userRole: "user" | "admin" }
export const updateUserRole = (id, userRole) =>
  axiosClient.patch(`/user/role/${id}`, { userRole });

// DELETE /user/delete/:id — admin only, also removes the user's reviews
export const deleteUser = (id) => axiosClient.delete(`/user/delete/${id}`);
