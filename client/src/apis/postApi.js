import axios from "../configs/axiosConfig";

export const getPostsApi = async (params) => {
  const response = await axios.get("/posts", { params });
  return response;
};

export const createPostApi = async (data) => {
  const response = await axios.post("/posts/create", data);
  return response;
};

export const deletePostApi = async (id) => {
  const response = await axios.delete(`/posts/delete/${id}`);
  return response;
};
