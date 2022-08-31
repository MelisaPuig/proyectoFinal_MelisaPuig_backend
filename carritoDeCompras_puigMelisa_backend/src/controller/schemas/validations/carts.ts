const NEW_CART = {
  type: 'object',
  additionalProperties: false,
  properties: {
    destinationAddress: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['destinationAddress'],
};

const CART_ADD_PRODUCT = {
  type: 'object',
  additionalProperties: false,
  properties: {
    productId: {
      type: 'string',
    },
    count: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
    },
  },
  required: ['productId', 'count'],
};

const CART_UPDATE_ITEM_COUNT = {
  type: 'object',
  additionalProperties: false,
  properties: {
    count: {
      type: 'number',
      minimum: 0,
      multipleOf: 1,
    },
  },
  required: ['count'],
};

export default { NEW_CART, CART_ADD_PRODUCT, CART_UPDATE_ITEM_COUNT };
