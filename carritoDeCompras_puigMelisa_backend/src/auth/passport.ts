import 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import usersDAO from '~/model/DAO/usersDAO';
import { NoPasswordUserType } from '~/types/User';

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await usersDAO.login(email, password);
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, (user as NoPasswordUserType)._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const dbUser = await usersDAO.getById(id as string);
    return done(null, dbUser);
  } catch (error) {
    return done(error, null);
  }
});

export default passport;
