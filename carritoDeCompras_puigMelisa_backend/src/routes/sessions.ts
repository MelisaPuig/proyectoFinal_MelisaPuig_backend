import cookieParser from 'cookie-parser';
import express from 'express';

import passport from '~/auth/passport';
import sessions from '~/auth/sessions';
import usersController from '~/controller/usersController';

const sessionRouter = express.Router();

sessionRouter.use(cookieParser());
sessionRouter.use(express.json());
sessionRouter.use(express.urlencoded({ extended: true }));
sessionRouter.use(sessions);
sessionRouter.use(passport.initialize());
sessionRouter.use(passport.session());
sessionRouter.get('/register', (_req, res) => res.render('register'));
sessionRouter.get('/token', usersController.getToken);
sessionRouter.get('/login', (_req, res) => res.render('login'));
sessionRouter.post('/register', usersController.add);
sessionRouter.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, _info) => {
    try {
      if (err || !user) {
        const error = new Error('An error occurred.');
        return next(error);
      }
      req.login(user, { session: true }, async (error) => {
        if (error) return next(error);
        return res.redirect('/productos');
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});
sessionRouter.use(usersController.passJWTToUser);
sessionRouter.get('/logout', usersController.logout);
sessionRouter.all('*', usersController.redirectNotLoggedInUsers);

export default sessionRouter;
