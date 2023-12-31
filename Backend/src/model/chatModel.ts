import mongoose, { Document, Model, Schema } from "mongoose";

export interface ChatMessage {
  chat_id: number;
  message: string;
  messagebyuser: boolean;
  dateTime: Date;
  seen: boolean;
}

export interface UserChats {
  user_id: string;
  chats: ChatMessage[];
  unread: number;
}

export interface IUser extends Document {
  user_id: string;
  user_name: string;
  online: boolean;
  messages: UserChats[];
}

const chatMessageSchema: Schema<ChatMessage> = new Schema({
  chat_id: { type: Number },
  message: String,
  messagebyuser: Boolean,
  dateTime: Date,
  seen: { type: Boolean, default: false },
});

const userChatsSchema: Schema<UserChats> = new Schema({
  user_id: {
    type: String,
  },
  unread: { type: Number, default: 0 },
  chats: [chatMessageSchema],
});

const userSchema: Schema<IUser> = new Schema({
  user_id: {
    type: String,
    required: [true, "A user id is required"],
    unique: true,
  },
  user_name: {
    type: String,
    required: [true, "A user name is required"],
  },
  online: {
    type: Boolean,
    default: false,
  },
  messages: [userChatsSchema],
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserModel;
