import mongoose from 'mongoose';
import validator from 'validator';

import { OrderType } from '~/types/Order';

const { Schema } = mongoose;

const OrderORM = new Schema<OrderType>(
  {
    date: {
      type: Schema.Types.Date,
      required: [true, 'Order must have a date.'],
    },
    orderNumber: {
      type: Schema.Types.Number,
      required: [true, 'The Order must have a number.'],
      min: [0, 'Order number cannot be less than zero.'],
    },
    state: {
      type: Schema.Types.String,
      required: [true, 'The Order must have a state.'],
      default: 'generated',
      validate: {
        validator: (v: string) => ['generated', 'solved'].includes(v),
        message: 'The order must have a valid state.',
      },
    },
    userMail: {
      type: Schema.Types.String,
      required: [true, 'The order must have an user email.'],
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'The order email must be valid.',
      },
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: [true, 'Item in order must have a product id.'],
          ref: 'Product',
        },
        count: {
          type: Schema.Types.Number,
          default: 0,
          min: [0, 'Cannot have less than zero of a product in an order.'],
        },
      },
    ],
  },
  {
    autoIndex: true,
    autoCreate: true,
    collection: 'orders',
    strict: true,
  },
);

const model = mongoose.model('Order', OrderORM);
export default model;
