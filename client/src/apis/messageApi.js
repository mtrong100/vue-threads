import axios from "../configs/axiosConfig";

export const getMessagesApi = async (id) => {
  const response = await axios.get(`/messages/${id}`);
  return response;
};

export const sendMessageApi = async (id, data) => {
  const response = await axios.post(`/messages/send/${id}`, data);
  return response;
};
