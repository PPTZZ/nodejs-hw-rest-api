import {
	addContact,
	getAllContacts,
	getContactById,
	removeContact,
	updateContact,
	updateStatusContact,
	validateBody,
} from '../index.js';
import { joiSchema, favoriteJoiSchema } from '../schemas/joi.js';

export const getContactsController = async (req, res, next) => {
	const results = await getAllContacts();
	try {
		res.status(200).json({
			message: 'Success',
			code: 200,
			data: results,
		});
	} catch (err) {
		res.status(404).json({
			message: 'Nu au fost gasite contacte in DB',
			code: 404,
		});
		next(err);
	}
};

export const getContactByIdController = async (req, res, next) => {
	const results = await getContactById(req.params.contactId);
	if (!results) {
		throw new Error();
	}
	try {
		res.status(200).json({
			message: 'Success',
			code: 200,
			data: results,
		});
	} catch (err) {
		res.status(404).json({
			message: 'Nu s-a gasit nici un contact cu acest id',
			code: 404,
		});
		next(err);
	}
};

export const addContactContorller = async (req, res, next) => {
	try {
		await validateBody(req.body, joiSchema);
		await addContact(req.body);
		res.status(200).json({
			message: 'Success',
			code: 200,
		});
	} catch (err) {
		res.status(401).json({
			message: 'One or more fields is invalid, pleascheck and try again',
			code: 401,
		});
		next(err);
	}
};

export const deleteContactController = async (req, res, next) => {
	const results = await getContactById(req.params.contactId);
	if (!results) {
		throw new Error();
	}
	try {
		await removeContact(req.params.contactId);
		res.status(200).json({
			message: 'Contact deleted',
			code: 200,
		});
	} catch (err) {
		res.status(404).json({
			message: 'Nu s-a gasit nici un contact cu acest id',
			code: 404,
		});
		next(err);
	}
};

export const updateContactController = async (req, res, next) => {
	const results = await getContactById(req.params.contactId);
	if (!results) {
		throw new Error();
	}
	try {
		await updateContact(req.params.contactId, req.body);
	} catch (err) {
		res.status(404).json({
			message: 'Nu s-a gasit nici un contact cu acest id',
			code: 404,
		});
		next(err);
	}
};

export const updateStatusController = async (req, res, next) => {
	const results = await getContactById(req.params.contactId);
	if (!results) {
		throw new Error();
	}
	try {
		await validateBody(req.body, favoriteJoiSchema);
		await updateStatusContact(req.params.contactId, req.body);
	} catch (err) {
		res.status(404).json({
			message: 'Nu s-a gasit nici un contact cu acest id',
			code: 404,
		});
		next(err);
	}
};
