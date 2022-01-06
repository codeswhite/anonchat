import { Dispatch } from "redux";
import PublicUser from "../../typings/models/publicUser";
import User from "../../typings/models/user";
import {
  deleteUserService,
  getPublicUsers,
  getUserByPid,
  setUserIsAdmin,
  setUserPublicName,
} from "../services/user.service";
import {
  DELETE_USER,
  RETRIEVE_PUBLIC_USERS,
  RETRIEVE_USER,
  USER_SET_IS_ADMIN,
  USER_UPDATE_PUBLIC_NAME,
} from "./types";

export interface IUserAction {
  type: string;
  payload: User;
}

export const retrievePublicUsers =
  () => async (dispatch: Dispatch<{ type: string; payload: PublicUser[] }>) => {
    try {
      const res: PublicUser[] = (await getPublicUsers()).data;

      dispatch({
        type: RETRIEVE_PUBLIC_USERS,
        payload: res,
      });

      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  };

export const retrieveUser =
  (pid: number) => async (dispatch: Dispatch<IUserAction>) => {
    try {
      const res: User = (await getUserByPid(pid)).data;

      dispatch({
        type: RETRIEVE_USER,
        payload: res,
      });

      return Promise.resolve(res);
    } catch (err) {
      return Promise.reject(err);
    }
  };

export const setAdmin =
  (id: string, isAdmin: boolean) =>
  async (dispatch: Dispatch<IUserAction>) => {
    try {
      const user: User = (await setUserIsAdmin(id, isAdmin)).data;

      dispatch({
        type: USER_SET_IS_ADMIN,
        payload: user,
      });

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  };

export const updatePublicName =
  (id: string, publicName?: string) => async (dispatch: Dispatch) => {
    try {
      const user: User = (await setUserPublicName(id, publicName)).data;

      dispatch({
        type: USER_UPDATE_PUBLIC_NAME,
        payload: user,
      });

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  };

export const deleteUser =
  (id: string) => async (dispatch: Dispatch<IUserAction>) => {
    try {
      const user: User = (await deleteUserService(id)).data;

      dispatch({
        type: DELETE_USER,
        payload: user,
      });

      return Promise.resolve(user);
    } catch (err) {
      return Promise.reject(err);
    }
  };
