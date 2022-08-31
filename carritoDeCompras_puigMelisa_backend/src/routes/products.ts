import express from 'express';
import productsController from '~/controller/productsController';

const usersRouter = express.Router();

usersRouter.get('/categories', productsController.getCategories);
usersRouter.get('/:id', productsController.getById);
usersRouter.get('/category/:category', productsController.getByCategory);
usersRouter.get('/', productsController.getAll);
usersRouter.post('/', productsController.add);
usersRouter.put('/:id', productsController.update);
usersRouter.delete('/:id', productsController.delete);

export default usersRouter;
