import CARTS from './carts';
import PRODUCTS from './products';
import USERS from './users';

const validationList = {
  ...CARTS,
  ...PRODUCTS,
  ...USERS,
} as const;

export default validationList;
