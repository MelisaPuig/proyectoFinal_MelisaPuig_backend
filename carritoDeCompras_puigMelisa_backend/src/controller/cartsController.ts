import { Request, Response, NextFunction } from 'express';

import cartsService from '~/services/cartsService';
import { NewCartType, CartItemType } from '~/types/Cart';
import apiUtils from './apiUtils';
import validator from './schemas';

type RequestWithUser = {
  email: string;
  [k: string]: unknown;
};

class CartsController {
  async get(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const { email } = req.user as RequestWithUser;
      const result = await cartsService.getByUserMail(email);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async add(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const { email } = req.user as RequestWithUser;
      await validator.validate(req.body, 'NEW_CART');
      const cartData = req.body as NewCartType;
      const { destinationAddress } = cartData;
      const result = await cartsService.newCart(email, { userMail: email, destinationAddress });
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async delete(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const { email } = req.user as RequestWithUser;
      const id = req.params.id;
      const result = await cartsService.delete(email, id);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async addItem(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const { email } = req.user as RequestWithUser;
      const cartId = req.params.id;
      await validator.validate(req.body, 'CART_ADD_PRODUCT');
      const newItem = req.body as CartItemType;
      const result = await cartsService.addItem(email, cartId, newItem);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async updateItemCount(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const { email } = req.user as RequestWithUser;
      const cartId = req.params.id;
      const productId = req.params.productId;
      await validator.validate(req.body, 'CART_UPDATE_ITEM_COUNT');
      const { count } = req.body as { count: number };
      const result = await cartsService.updateItemCount(email, cartId, productId, count);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async removeItem(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const { email } = req.user as RequestWithUser;
      const cartId = req.params.id;
      const indexToRemove = Number.parseInt(req.params.itemIndex, 10);
      const result = await cartsService.removeItem(email, cartId, indexToRemove);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async empty(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const { email } = req.user as RequestWithUser;
      const cartId = req.params.id;
      const result = await cartsService.emptyCart(email, cartId);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }
}

export default new CartsController();
