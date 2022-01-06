import { Dispatch } from "redux";
import Chat from "../../typings/models/chat";
import Message from "../../typings/models/message";
import { SEND_MESSAGE } from "./types";
import { postMessage } from "../services/chat.service";

export const sendMessage =
  (
    privateId: string,
    publicId: string,
    from: string,
    title: string,
    text: string
  ) =>
  async (
    dispatch: Dispatch<{
      type: string;
      payload: {
        newChat: Chat;
        message: Message;
      };
    }>
  ) => {
    try {
      const newChat: Chat = (
        await postMessage(privateId, publicId, from, title, text)
      ).data;

      dispatch({
        type: SEND_MESSAGE,
        payload: {
          newChat: newChat,
          message: newChat.messages.at(-1)!,
        },
      });

      return Promise.resolve({
        newChat: newChat,
        message: newChat.messages.at(-1)!,
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };
