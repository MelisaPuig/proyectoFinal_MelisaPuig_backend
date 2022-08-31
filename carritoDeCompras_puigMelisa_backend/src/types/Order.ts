import mongoose from 'mongoose';

export type OrderItemType = {
  count: number;
  productId: mongoose.ObjectId;
};

export type OrderStateType = 'generated' | 'solved';

export type OrderType = {
  _id: mongoose.ObjectId;
  date: Date;
  items: OrderItemType[];
  orderNumber: number;
  state: OrderStateType;
  userMail: string;
};

export type NewOrderType = Omit<OrderType, '_id' | 'orderNumber'>;
