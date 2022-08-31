import mongoose from 'mongoose';

import { ProductType } from '~/types/Product';

const { Schema } = mongoose;

const ProductORM = new Schema<ProductType>(
  {
    category: {
      type: Schema.Types.String,
      required: [true, 'The Product must have a category.'],
      minlength: [1, 'Category too short!'],
    },
    name: {
      type: Schema.Types.String,
      required: [true, 'The Product must have a name.'],
      minlength: [1, 'Product name too short!'],
    },
    description: {
      type: Schema.Types.String,
      required: [true, 'The Product must have a description.'],
      minlength: [1, 'Product description too short!'],
    },
    picture: {
      type: Schema.Types.String,
      required: [true, 'The Product must have a picture.'],
    },
    price: {
      type: Schema.Types.Number,
      required: [true, 'The Product must have a price.'],
      min: [0, 'Cannot have less than zero price.'],
    },
    stock: {
      type: Schema.Types.Number,
      required: [true, 'The Product must have stock.'],
      min: [0, 'Cannot have less than zero stock.'],
    },
  },
  {
    autoIndex: true,
    autoCreate: true,
    collection: 'products',
    strict: true,
  },
);

const model = mongoose.model('Product', ProductORM);
export default model;
