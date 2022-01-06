import Message from "./message";

interface Chat {
  _id: string;
  public: {
    id: string;
    name: string;
  }
  private: {
    id: string;
    name: string;
  };
  messages: Message[];
}
export = Chat;
