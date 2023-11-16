import mongoose, { Document, Model, Schema } from "mongoose";

export interface ChatMessage {
  chat_id: number;
  message: string;
  dateTime: Date;
}

export interface UserChats {
  user_id: string;
  chats: ChatMessage[];
}

export interface IUser extends Document {
  user_id: number;
  user_name: string;
  status: "online" | "offline";
  messages: UserChats[];
}

const chatMessageSchema: Schema<ChatMessage> = new Schema({
  chat_id: { type: Number, required: true, unique: true },
  message: String,
  dateTime: Date,
});

const userChatsSchema: Schema<UserChats> = new Schema({
  user_id: {
    type: String,
    unique: true,
    required: [true, "A user id is required"],
  },
  chats: [chatMessageSchema],
});

const userSchema: Schema<IUser> = new Schema({
  user_id: {
    type: Number,
    required: [true, "A user id is required"],
    unique: true,
  },
  user_name: {
    type: String,
    required: [true, "A user name is required"],
  },
  status: {
    type: String,
    default: "offline",
  },
  messages: [userChatsSchema],
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserModel;
