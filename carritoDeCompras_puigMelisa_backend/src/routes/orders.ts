import express from 'express';
import orderController from '~/controller/ordersController';

const orderRouter = express.Router();

orderRouter.get('/', orderController.getByUserMail);
orderRouter.post('/', orderController.addByUser);

export default orderRouter;
