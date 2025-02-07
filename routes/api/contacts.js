import { Router } from 'express';
import auth from '../../middleware/auth.js';
import {
	addContactContorller,
	deleteContactController,
	getContactByIdController,
	getContactsController,
	updateContactController,
	updateStatusController,
} from '../../service/controllers/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/', auth, getContactsController);
contactsRouter.get('/:contactId', auth, getContactByIdController);
contactsRouter.post('/', auth, addContactContorller);
contactsRouter.delete('/:contactId', auth, deleteContactController);
contactsRouter.put('/:contactId', auth, updateContactController);
contactsRouter.patch('/:contactId/favorite', auth, updateStatusController);

export default contactsRouter;
