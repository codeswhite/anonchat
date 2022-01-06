import { AnyAction } from "redux";
import PublicUser from "../../typings/models/publicUser";
import {
  DELETE_USER,
  RETRIEVE_PUBLIC_USERS,
  USER_UPDATE_PUBLIC_NAME,
} from "../actions/types";

const initialState: PublicUser[] = [];

function publicUsersReducer(state = initialState, action: AnyAction) {
  const { type, payload } = action;

  switch (type) {
    case RETRIEVE_PUBLIC_USERS:
      return payload;

    case USER_UPDATE_PUBLIC_NAME:
      // remove old public user
      state = state.filter((publicUser) => publicUser.pid !== payload.pid);
      // add new public user from payload
      if (payload.publicName) state = [...state, payload];
      // return result
      return state;

    case DELETE_USER:
      return state.filter((user) => user.pid !== payload.pid);

    default:
      return state;
  }
}

export { publicUsersReducer };
