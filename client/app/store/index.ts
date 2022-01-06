import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import PublicUser from "../../typings/models/publicUser";
import User from "../../typings/models/user";
import { publicUsersReducer } from "./publicUsers";
import { userReducer } from "./users";

export interface IRootState {
  user: User;
  publicUsers: PublicUser[];
}

export const rootReducer = combineReducers({
  publicUsers: publicUsersReducer,
  user: userReducer,
});

export const initialState = {
  publicUsers: { publicUsers: [] },
  user: {},
};

export function getStore() {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
}
