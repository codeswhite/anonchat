import { AnyAction } from "redux";
import Chat from "../../typings/models/chat";

import {
  RETRIEVE_USER,
  SEND_MESSAGE,
  USER_SET_IS_ADMIN,
  USER_UPDATE_PUBLIC_NAME,
} from "../actions/types";

const initialState: {
  pid?: number;
  chats: Chat[];
} = {
  pid: undefined,
  chats: [],
};

function userReducer(userState = initialState, action: AnyAction) {
  const { type, payload } = action;

  switch (type) {
    case RETRIEVE_USER:
      return payload;

    case USER_SET_IS_ADMIN:
      return payload.pid === userState.pid ? payload : userState;

    case USER_UPDATE_PUBLIC_NAME:
      return payload.pid === userState.pid ? payload : userState;

    case SEND_MESSAGE:
      const { newChat, message } = payload;

      find: {
        // Look for existing chat
        for (const chat of userState.chats) {
          if (
            chat.public.name === newChat.public.name &&
            chat.private.name === newChat.private.name
          ) {
            chat.messages.push(message);
            break find;
          }
        }
        // Create new chat
        userState.chats.push(newChat);
      }
      return userState;

    default:
      return userState;
  }
}

export {
  userReducer,
};
