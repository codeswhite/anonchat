import { Schema, model, ObjectId, SchemaTypes } from "mongoose";

interface IChat {
  _id: string;
  public: {
    id: ObjectId;
    name: string;
  };
  private: {
    id: ObjectId;
    name: string;
  };
  messages: [
    {
      date: Date;
      from: string;
      title: string;
      text: string;
    }
  ];
}

const ChatSchema = new Schema<IChat>({
  public: {
    id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
  },
  private: {
    id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
  },
  messages: [
    {
      date: { type: Date, required: true, default: new Date() },
      from: { type: String, required: true },
      title: { type: String, required: true },
      text: { type: String, required: true },
    },
  ],
});

const ChatModel = model("Chat", ChatSchema);

export { IChat, ChatModel };
