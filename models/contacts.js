import fs from 'fs/promises';
import path from 'path';

const contacts = path.resolve('./contacts.json');
const data = async () => {
	try {
		const data = await fs.readFile(contacts, 'utf8');
		return data;
	} catch (err) {
		return err;
	}
};

const listContacts = async () => {
	console.log(data);
};

const getContactById = async (contactId) => {};

const removeContact = async (contactId) => {};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

export default {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
};
