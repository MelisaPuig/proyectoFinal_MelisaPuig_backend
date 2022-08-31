import mongoose from 'mongoose';

import { ProductType } from './Product';

export type CartItemType = {
  count: number;
  productId: string;
};

export type CartType = {
  _id: mongoose.ObjectId;
  date: Date;
  destinationAddress: string;
  items: CartItemType[];
  userMail: string;
};

export type NewCartType = {
  destinationAddress: string;
  userMail: string;
};

export type CartWithProductsType = Omit<CartType, 'items'> & {
  items: {
    product: ProductType;
    count: number;
  }[];
};
