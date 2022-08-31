import express from 'express';
import viewsController from '~/controller/viewsController';

const viewsRouter = express.Router();

viewsRouter.get('/register', viewsController.renderRegister);
viewsRouter.get('/chat', viewsController.renderChat);
viewsRouter.get('/productos', viewsController.renderProductsList);
viewsRouter.get('/productos/:id', viewsController.renderSpecificProduct);
viewsRouter.get('/productos/*', viewsController.renderProductNotFound);
viewsRouter.get('/carrito', viewsController.renderCart);
viewsRouter.get('/info', viewsController.renderInfo);
viewsRouter.get('*', (_req, res) => {
  res.redirect('/productos');
});

export default viewsRouter;
