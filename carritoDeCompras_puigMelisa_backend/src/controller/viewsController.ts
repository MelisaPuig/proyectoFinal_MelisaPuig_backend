import { Request, Response, NextFunction } from 'express';
import { isUndefined } from 'lodash';

import CONFIG from '~/config';
import cartsService from '~/services/cartsService';
import productsService from '~/services/productsService';

type RequestWithUser = {
  email: string;
  [k: string]: unknown;
};

class ViewsController {
  async renderRegister(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    res.render('register');
  }

  async renderLogin(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    res.render('login');
  }

  async renderChat(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    res.render('chat');
  }

  async renderProductsList(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    const products = await productsService.getAll();
    const hasProducts = products.length > 0;
    res.render('products', { products, hasProducts, showCategoriesSelect: true });
  }

  async renderSpecificProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const { email } = req.user as RequestWithUser;
      const product = await productsService.getById(id);
      const cart = await cartsService.getByUserMail(email);
      let count = 0;
      if (cart) {
        console.log(cart);
        const thisProduct = cart.items.filter((e) => e.product._id.toString() === id);
        count = isUndefined(thisProduct[0]) ? 0 : thisProduct[0].count;
      }
      res.render('product', { ...product, count });
    } catch (_error) {
      console.error(_error);
      next();
    }
  }

  async renderProductNotFound(req: Request, res: Response, _next: NextFunction): Promise<void> {
    res.status(404).send(`No se pudo encontrar el producto ${req.originalUrl}`);
  }

  async renderCart(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('cart', {});
    } catch (_error) {
      console.error(_error);
      next();
    }
  }

  async renderInfo(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('info', { info: CONFIG });
    } catch (_error) {
      console.error(_error);
      next();
    }
  }

  // TODO
  // async renderFormulario(req, res, next) {
  //   const { username } = req.user;
  //   res.render('formulario', { username });
  // }
}

export default new ViewsController();
