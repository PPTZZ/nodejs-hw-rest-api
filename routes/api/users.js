import { Router } from 'express';
import {
	createUserController,
	loginUserController,
	getCurrentUserController,
	logOutUserController,
} from '../../service/controllers/usersController.js';
import { uploadAvatarController } from '../../service/controllers/fileController.js';
import auth from '../../middleware/auth.js';
import upload from '../../middleware/multer.js';

const usersRouter = Router();

usersRouter.post('/signup', createUserController);
usersRouter.post('/login', loginUserController);
usersRouter.patch('/:userId/logout', auth, logOutUserController);
usersRouter.get('/current', auth, getCurrentUserController);
usersRouter.put(
	'/avatars',
	auth,
	upload.single('avatar'),
	uploadAvatarController
);

export default usersRouter;
