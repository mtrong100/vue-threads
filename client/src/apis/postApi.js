import axios from "../configs/axiosConfig";

export const createPostApi = async (data) => {
  const response = await axios.post("/posts/create", data);
  return response;
};
