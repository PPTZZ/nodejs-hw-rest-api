import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contacts = path.resolve('./models/contacts.json');

export const listContacts = async () => {
	try {
		const data = await fs.readFile(contacts, 'utf8');
		const results = await JSON.parse(data);
		return results;
	} catch (err) {
		return err;
	}
};

export const getContactById = async (contactId) => {
	try {
		const contactList = await listContacts();
		const foundContact = contactList.find(
			(contact) => contact.id === contactId
		);
		return foundContact;
	} catch (err) {
		return err;
	}
};

export const removeContact = async (contactId) => {
	try {
		const contactList = await listContacts();
		const newList = contactList.filter((contact) => contact.id !== contactId);
		const data = JSON.stringify(newList);
		await fs.writeFile(contacts, data);
	} catch (err) {
		return err;
	}
};

export const addContact = async (body) => {
	try {
		const newItem = {
			id: nanoid(21),
			...body,
		};
		const contactList = await listContacts();
		const newList = [...contactList, newItem];
		const data = JSON.stringify(newList);
		await fs.writeFile(contacts, data);
	} catch (err) {
		return err;
	}
};

export const updateContact = async (contactId, body) => {
	const foundContact = await getContactById(contactId);
	if (foundContact) {
		try {
			const { name, email, phone } = body;
			const contactList = await listContacts();
			const newList = contactList.map((contact) => {
				if (contact.id === contactId) {
					return { ...contact, name, email, phone };
				}
				throw new Error(404);
			});
			const data = JSON.stringify(newList);
			await fs.writeFile(contacts, data);
		} catch (err) {
			return err;
		}
	} else {
		throw new Error(404);
	}
};
