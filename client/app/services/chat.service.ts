import axios from "axios";
import Chat from "../../typings/models/chat";

export const getChatById = (id: string) => {
  return axios.get<Chat>(`/api/chats/${id}`);
};
export const postMessage = (
  privateId: string,
  publicId: string,
  from: string,
  title: string,
  text: string
) => {
  return axios.post<Chat>(`/api/chats/`, { privateId, publicId, from, title, text });
};
