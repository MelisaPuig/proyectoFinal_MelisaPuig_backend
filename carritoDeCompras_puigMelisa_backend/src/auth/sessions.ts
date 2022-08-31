import session from 'express-session';
import connectMongo from 'connect-mongo';

import CONFIG from '~/config';

const { MONGO_URL, SESSION_SECRET, SESSION_DURATION } = CONFIG;

console.log(MONGO_URL);

export default session({
  store: connectMongo.create({
    mongoUrl: MONGO_URL,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: SESSION_DURATION * 1000,
    path: '/',
    httpOnly: true,
    secure: false,
  },
});
