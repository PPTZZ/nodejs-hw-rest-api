import { Router } from 'express';
import { joiSchema, favoriteJoiSchema } from '../../service/schemas/Joi.js';
import { getContactsController } from '../../service/controllers/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/', auth, getContactsController => {});

contactsRouter.get('/:contactId', async (req, res, next) => {
	const foundContact = await getContactById(req.params.contactId);
	res.json(foundContact);
});

contactsRouter.post('/', async (req, res, next) => {
	const { name, email, phone, favorite } = req.body;
	if (!name || !email || !phone || !favorite) {
		return res.status(400).json({ error: 'Fields cannot be empty' });
	}
	try {
		const value = await joiSchema.validateAsync(req.body);
		if (value) {
			await addContact(req.body);
			res.status(201).json({ message: 'Added contact' });
		}
	} catch (err) {
		res
			.status(400)
			.json({ error: 'One or more fields are invalid pleas check body' });
	}
});

contactsRouter.delete('/:contactId', async (req, res, next) => {
	try {
		await removeContact(req.params.contactId);
		res.json({ message: 'contact deleted' });
	} catch (err) {
		res.json(err);
	}
});

contactsRouter.put('/:contactId', async (req, res, next) => {
	try {
		const value = await joiSchema.validateAsync(req.body);
		if (value) {
			await updateContact(req.params.contactId, req.body);
			res.status(200).json({ message: 'Updated contact' });
		}
	} catch (err) {
		res
			.status(400)
			.json({ message: 'One or more fields are incorect please check body' });
	}
});

contactsRouter.patch('/:contactId/favorite', async (req, res) => {
	try {
		const value = await favoriteJoiSchema.validateAsync(req.body);
		if (value) {
			await updateStatusContact(req.params.contactId, req.body);
			res.status(200).json({ message: 'Updated contact' });
		}
	} catch (err) {
		res.status(400).json(err.message);
	}
});

export default contactsRouter;
