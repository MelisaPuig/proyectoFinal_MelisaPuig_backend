import mongoose from 'mongoose';

export type UserType = {
  _id: mongoose.ObjectId;
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  profilePicture: string;
};

export type NewUserType = Omit<UserType, '_id'>;

export type NoPasswordUserType = Omit<UserType, 'password'>;

export type PasswordAndEmailType = {
  email: string;
  password: string;
};
