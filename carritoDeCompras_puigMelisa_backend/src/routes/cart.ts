import express from 'express';
import cartsController from '~/controller/cartsController';

const cartsRouter = express.Router();

cartsRouter.get('/', cartsController.get);
cartsRouter.post('/', cartsController.add);
cartsRouter.delete('/:id', cartsController.delete);
cartsRouter.post('/:id/items', cartsController.addItem);
cartsRouter.put('/:id/items/:productId', cartsController.updateItemCount);
cartsRouter.delete('/:id/items/:itemIndex', cartsController.removeItem);
cartsRouter.delete('/:id/items', cartsController.empty);

export default cartsRouter;
