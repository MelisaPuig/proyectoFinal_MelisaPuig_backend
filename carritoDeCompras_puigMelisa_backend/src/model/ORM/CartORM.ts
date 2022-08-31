import mongoose from 'mongoose';
import validator from 'validator';

import { CartType } from '~/types/Cart';

const { Schema } = mongoose;

const CartORM = new Schema<CartType>(
  {
    date: {
      type: Schema.Types.Date,
      required: [true, 'Cart must have a date.'],
    },
    destinationAddress: {
      type: Schema.Types.String,
      required: [true, 'The cart must have a destination address.'],
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: [true, 'Item in cart must have a product id.'],
          ref: 'Product',
        },
        count: {
          type: Schema.Types.Number,
          default: 0,
          min: [0, 'Cannot have less than zero of a product in a cart.'],
        },
      },
    ],
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
    collection: 'carts',
    strict: true,
  },
);

const model = mongoose.model('Cart', CartORM);
export default model;
