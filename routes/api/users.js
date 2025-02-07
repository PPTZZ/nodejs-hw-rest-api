import { Router } from 'express';
import {
	createUserController,
	loginUserController,
    getCurrentUserController,
	logOutUserController
} from '../../service/controllers/usersController.js';
import auth from '../../middleware/auth.js';

const usersRouter = Router();

usersRouter.post('/signup', createUserController);
usersRouter.post('/login', loginUserController);
usersRouter.patch('/:userId/logout', auth, logOutUserController);
usersRouter.get('/current',auth, getCurrentUserController);

export default usersRouter
