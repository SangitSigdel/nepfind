import mongoose, { Document, Model, Schema } from "mongoose";

export interface ChatMessage {
  chat_id: number;
  message: string;
  messageByUser: boolean;
  dateTime: Date;
}

export interface UserChats {
  user_id: string;
  chats: ChatMessage[];
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
  messageByUser: Boolean,
  dateTime: Date,
});

const userChatsSchema: Schema<UserChats> = new Schema({
  user_id: {
    type: String,
  },
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
