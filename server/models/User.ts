import { Schema, model, SchemaTypes, ObjectId } from "mongoose";

interface IUser {
  pid: number;
  hash: string;
  publicName?: string;
  chats: ObjectId[];
  isAdmin: boolean;
}

const UserSchema = new Schema<IUser>({
  pid: { type: Number, required: true },
  hash: { type: String, required: true },
  publicName: { type: String },
  chats: [
    { type: SchemaTypes.ObjectId, ref:"Chat", required: true },
  ],
  isAdmin: { type: Boolean, default: false },
});

const UserModel = model("User", UserSchema);

export { IUser, UserModel };
