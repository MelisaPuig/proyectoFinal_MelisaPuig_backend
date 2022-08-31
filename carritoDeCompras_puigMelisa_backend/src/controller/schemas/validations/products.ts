const PRODUCT_DATA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    category: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    name: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    description: {
      type: 'string',
      minLength: 1,
    },
    picture: {
      type: 'string',
      maxLength: 300,
      minLength: 1,
    },
    price: {
      type: 'number',
      minimum: 0,
      multipleOf: 0.01,
    },
    stock: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
    },
  },
  required: ['category', 'name', 'description', 'picture', 'price', 'stock'],
};

export default { PRODUCT_DATA };
