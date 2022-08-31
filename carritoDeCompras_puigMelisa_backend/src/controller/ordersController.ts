import { Request, Response, NextFunction } from 'express';

import ordersService from '~/services/ordersService';
import apiUtils from './apiUtils';

type RequestWithUser = {
  email: string;
  [k: string]: unknown;
};

class OrdersController {
  async addByUser(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const { email } = req.user as RequestWithUser;
      const result = await ordersService.addByUserCart(email);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async getByUserMail(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const { email } = req.user as RequestWithUser;
      const result = await ordersService.getByUserMail(email);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }
}

export default new OrdersController();
