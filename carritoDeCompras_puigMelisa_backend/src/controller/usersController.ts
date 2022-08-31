import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import apiUtils from './apiUtils';
import CONFIG from '~/config';
import schemas from './schemas';
import userService from '~/services/userService';
import { NewUserType, NoPasswordUserType, PasswordAndEmailType } from '~/types/User';
import { isUndefined } from 'lodash';

const { SESSION_SECRET, SESSION_DURATION } = CONFIG;

class UsersController {
  async add(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const validatedUserData = await schemas.validate(req.body, 'NEW_USER');
      const newUserData = validatedUserData as NewUserType & { password2: string };
      if (newUserData.password !== newUserData.password2) {
        throw new Error('Passwords do not match.');
      }
      const result = await userService.add(newUserData);
      res.render('login', { userRegisterSuccess: true, registeredUser: result.email });
    } catch (error) {
      const err = error as Error;
      console.error(err);
      res.render('register', { errored: true, error: err.message });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const validatedUserData = await schemas.validate(req.body, 'USER_LOGIN');
      const { email, password } = validatedUserData as PasswordAndEmailType;
      const result = await userService.login(email, password);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async getToken(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const noTokenError = new Error('TOKEN_NOT_EXIST');
      if (isUndefined(req.user)) {
        return apiUtils.sendError(req, res, noTokenError, 404);
      }
      const reqUser = req.user as NoPasswordUserType;
      if (isUndefined(reqUser._id)) {
        return apiUtils.sendError(req, res, noTokenError, 404);
      }
      const token = jwt.sign(reqUser, SESSION_SECRET, {
        expiresIn: SESSION_DURATION,
        algorithm: 'HS256',
      });
      return apiUtils.sendResponse(res, token);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async getUserData(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    try {
      const userData = req.user;
      if (!userData) {
        return apiUtils.sendResponse(res, {});
      }
      return apiUtils.sendResponse(res, userData);
    } catch (error) {
      next(error);
      return false;
    }
  }

  async passJWTToUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return next();
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
        return next();
      }
      const payload = jwt.verify(token, SESSION_SECRET);
      req.user = payload;
      next();
    } catch (error) {
      return next(error);
    }
  }

  async redirectNotLoggedInUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reqUser = req.user;
      if (!reqUser) {
        return res.redirect(302, '/login');
      }
      if (isUndefined((req.user as NoPasswordUserType)._id)) {
        return res.redirect(302, '/login');
      }
      next();
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      req.user = {};
      await req.session.destroy(() => {});
      res.redirect(301, '/login');
    } catch (error) {
      return next(error);
    }
  }
}

export default new UsersController();
