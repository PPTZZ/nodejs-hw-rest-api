import { Router } from 'express';
import {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
} from '../../models/contacts.js';
import Joi from 'joi';

const router = Router();
const schema = Joi.object({
	name: Joi.string().alphanum().min(3).max(30),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ['com', 'net'] },
	}),
	phone: Joi.number(),
});

router.get('/', async (req, res, next) => {
	try {
		const contacts = await listContacts();
		res.json(contacts);
	} catch (err) {
		res.status(400);
	}
});

router.get('/:contactId', async (req, res, next) => {
	const foundContact = await getContactById(req.params.contactId);
	res.json(foundContact);
});

router.post('/', async (req, res, next) => {
	const { name, email, phone } = req.body;
	if (!name || !email || !phone) {
		return res.status(400).json({ error: 'Fields cannot be empty' });
	}
	try {
		const value = await schema.validateAsync({ name, email, phone });
		if (value) {
			await addContact({ name, email, phone });
			res.status(201).json({ message: 'Added contact' });
		}
	} catch (err) {
		res
			.status(400)
			.json({ message: 'One or more fields are incorect please check body' });
	}
});

router.delete('/:contactId', async (req, res, next) => {
	try {
		await removeContact(req.params.contactId);
		res.json({ message: 'contact deleted' });
	} catch (err) {
		res.json(err);
	}
});

router.put('/:contactId', async (req, res, next) => {
	const { name, email, phone } = req.body;
	try {
		const value = await schema.validateAsync({ name, email, phone });
		if (value) {
			await updateContact(req.params.contactId,{ name, email, phone });
			res.status(200).json({ message: 'Updated contact' });
		}
	} catch (err) {
		res
			.status(400)
			.json({ message: 'One or more fields are incorect please check body' });
	}
});

export default router;
