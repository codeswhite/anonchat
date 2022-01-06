import Chat from "./chat";
import Message from "./chat";

interface User {
  _id: string;
  pid: number;
  hash: string;
  publicName?: string;
  chats: Chat[];
  isAdmin: boolean;
}
export = User;
