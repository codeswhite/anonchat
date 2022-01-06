import axios from "axios";
import User from "../../typings/models/user";
import PublicUser from "../../typings/models/publicUser";

export const getAllUsers = () => {
  return axios.get<User[]>("/api/users/all");
};
export const getPublicUsers = () => {
  return axios.get<PublicUser[]>("/api/users/public");
};
export const getUserByPid = (pid: number) => {
  return axios.get<User>(`/api/users/${pid}/aquire`);
};
export const getUserById = (id: string) => {
  return axios.get<User>(`/api/users/${id}`);
};
export const setUserIsAdmin = (id: string, isAdmin: boolean) => {
  return axios.put<User>(`/api/users/${id}/setAdmin`, { isAdmin });
};
export const setUserPublicName = (id: string, publicName?: string) => {
  return axios.put<User>(`/api/users/${id}/updatePublicName`, { publicName });
};
export const deleteUserService = (id: string) => {
  return axios.delete<User>(`/api/users/${id}`);
};
