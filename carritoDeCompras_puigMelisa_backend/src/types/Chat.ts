import mongoose from 'mongoose';

export type ChatMessageTypesType = 'user' | 'system';

export type ChatMessageType = {
  _id: mongoose.ObjectId;
  body: string;
  date: Date;
  type: ChatMessageTypesType;
  userMail: string;
};

export type NewChatMessageType = Omit<ChatMessageType, '_id' | 'type' | 'date'>;

export type NewChatMessageWithDataType = Omit<ChatMessageType, '_id'>;
