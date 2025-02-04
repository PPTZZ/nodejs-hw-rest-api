import { Router } from 'express';
import {
	createUserController,
	loginUserController,
	updateUserController,
    getCurrentUsernameController
} from '../../service/controllers/usersController';

const usersRouter = Router();

usersRouter.post('/users/signup', createUserController);
usersRouter.post('/users/login', loginUserController);
usersRouter.patch('/users/:userId/logout', auth, updateUserController);
usersRouter.get('/', auth, getCurrentUsernameController);
