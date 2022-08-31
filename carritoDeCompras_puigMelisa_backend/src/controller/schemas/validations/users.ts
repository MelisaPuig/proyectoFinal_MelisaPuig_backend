const NEW_USER = {
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    name: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    password: {
      type: 'string',
      maxLength: 50,
      minLength: 1,
    },
    password2: {
      type: 'string',
      maxLength: 50,
      minLength: 1,
    },
    profilePicture: {
      type: 'string',
      maxLength: 500,
      minLength: 1,
    },
    phoneNumber: {
      type: 'string',
      maxLength: 500,
      minLength: 1,
    },
  },
  required: ['email', 'name', 'password', 'password2', 'profilePicture', 'phoneNumber'],
};

const USER_LOGIN = {
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      maxLength: 255,
      minLength: 1,
    },
    password: {
      type: 'string',
      maxLength: 50,
      minLength: 1,
    },
  },
  required: ['email', 'password'],
};

export default { NEW_USER, USER_LOGIN };
