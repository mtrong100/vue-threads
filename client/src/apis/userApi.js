import axios from "../configs/axiosConfig";

export const getUsersApi = async (params) => {
  const response = await axios.get("/users", { params });
  return response;
};

export const getFriendsApi = async () => {
  const response = await axios.get("/users/friends");
  return response;
};

export const registerUserApi = async (data) => {
  const response = await axios.post("/users/register", data);
  return response;
};

export const loginUserApi = async (data) => {
  const response = await axios.post("/users/login", data);
  return response;
};

export const logoutUserApi = async () => {
  const response = await axios.post("/users/logout");
  return response;
};

export const getUserDetailsApi = async (id) => {
  const response = await axios.get(`/users/${id}`);
  return response;
};

export const updateUserProfileApi = async (data) => {
  const response = await axios.put("/users/profile", data);
  return response;
};

export const resetPasswordApi = async (data) => {
  const response = await axios.put("/users/reset-password", data);
  return response;
};

export const sendOtpCodeApi = async (data) => {
  const response = await axios.post("/users/send-otp-code", data);
  return response;
};

export const toggleFollowUserApi = async (id) => {
  const response = await axios.post(`/users/toggle-follow/${id}`);
  return response;
};
