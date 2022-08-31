import mongoose from 'mongoose';

export type ProductType = {
  _id: mongoose.ObjectId;
  category: string;
  description: string;
  name: string;
  picture: string;
  price: number;
  stock: number;
};

export type NewProductType = Omit<ProductType, '_id' | 'stock'>;

export type UpdateableProductType = {
  category: string;
  description: string;
  name: string;
  picture: string;
  price: number;
};
