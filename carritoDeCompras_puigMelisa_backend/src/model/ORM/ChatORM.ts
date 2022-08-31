import mongoose from 'mongoose';
import validator from 'validator';

import { ChatMessageType } from '~/types/Chat';

const { Schema } = mongoose;

const ChatMessageORM = new Schema<ChatMessageType>(
  {
    body: {
      type: Schema.Types.String,
      required: [true, 'The chat message must have a body.'],
    },
    date: {
      type: Schema.Types.Date,
      required: [true, 'ChatMessage must have a date.'],
    },
    type: {
      type: Schema.Types.String,
      required: [true, 'ChatMessage must have a date.'],
      validate: {
        validator: (v: string) => ['user', 'system'].includes(v),
        message: 'The message type can only be "user" or "system".',
      },
    },
    userMail: {
      type: Schema.Types.String,
      required: [true, 'The chat message must have an email.'],
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'The chat message email must be valid.',
      },
    },
  },
  {
    autoIndex: true,
    autoCreate: true,
    collection: 'chats',
    strict: true,
  },
);

const model = mongoose.model('Chat', ChatMessageORM);
export default model;
