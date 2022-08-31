import mongoose from 'mongoose';
import validator from 'validator';

import { UserType } from '~/types/User';

const { Schema } = mongoose;

const UserORM = new Schema<UserType>(
  {
    email: {
      type: Schema.Types.String,
      unique: true,
      required: [true, 'The user must have an email.'],
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'The user must have a valid email.',
      },
    },
    name: {
      type: Schema.Types.String,
      required: [true, 'The user must have a name.'],
      minlength: [1, 'Username too short!'],
    },
    phoneNumber: {
      type: Schema.Types.String,
      required: [true, 'The user must have a phone number.'],
      minlength: [1, 'Phone number too short!'],
    },
    password: {
      type: Schema.Types.String,
      required: [true, 'The user must have a password.'],
      minlength: [1, 'Password too short!'],
    },
    profilePicture: {
      type: Schema.Types.String,
      required: [true, 'The user must have a profile picture.'],
    },
  },
  {
    autoIndex: true,
    autoCreate: true,
    collection: 'users',
    strict: true,
  },
);

const model = mongoose.model('User', UserORM);
export default model;
