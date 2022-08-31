import express from 'express';
import usersController from '~/controller/usersController';

const usersRouter = express.Router();

usersRouter.get('/data', usersController.getUserData);

export default usersRouter;
