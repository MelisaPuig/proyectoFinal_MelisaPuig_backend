import { Request, Response, NextFunction } from 'express';

import apiUtils from './apiUtils';
import schemas from './schemas';
import productsService from '~/services/productsService';
import { NewProductType } from '~/types/Product';

class ProductsController {
  async add(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const validatedProductData = await schemas.validate(req.body, 'PRODUCT_DATA');
      const newProductData = validatedProductData as NewProductType;
      const result = await productsService.add(newProductData);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err, 500);
    }
  }

  async getById(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const id = req.params.id;
      const result = await productsService.getById(id);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async getByCategory(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const id = req.params.category;
      const result = await productsService.getByCategory(id);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async getCategories(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const result = await productsService.getCategories();
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async getAll(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const result = await productsService.getAll();
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async update(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const id = req.params.id;
      const validatedProductData = await schemas.validate(req.body, 'PRODUCT_DATA');
      const newProductData = validatedProductData as NewProductType;
      const result = await productsService.update(id, newProductData);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }

  async delete(req: Request, res: Response, _next: NextFunction): Promise<boolean> {
    try {
      const id = req.params.id;
      const result = await productsService.delete(id);
      return apiUtils.sendResponse(res, result);
    } catch (error) {
      const err = error as Error;
      return apiUtils.sendError(req, res, err);
    }
  }
}

export default new ProductsController();
