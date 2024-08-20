import axios from "../configs/axiosConfig";

export const getCommentsApi = async (id, params) => {
  const response = await axios.get(`/comments/${id}`, { params });
  return response;
};

export const createCommentApi = async (id, data) => {
  const response = await axios.post(`/comments/create/${id}`, data);
  return response;
};

export const deleteCommentApi = async (id) => {
  const response = await axios.delete(`/comments/${id}`);
  return response;
};
