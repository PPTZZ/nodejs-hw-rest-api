import { Contact } from '../schemas/contacts.js';
export const listContacts = async () => {
	try {
		const data = Contact.find({});
		return data;
	} catch (err) {
		return err;
	}
};

export const getContactById = async contactId => {
	try {
		const data = await Contact.findById(contactId);
		return data;
	} catch (err) {
		return err;
	}
};

export const removeContact = async contactId => {
	try {
		await Contact.deleteOne({ _id: contactId });
	} catch (err) {
		return err;
	}
};

export const addContact = async body => {
	try {
		await Contact.create({
			...body,
		});
	} catch (err) {
		throw new Error(err.message);
	}
};

export const updateContact = async (contactId, body) => {
	try {
		const foundContact = await getContactById(contactId);
		if (foundContact) {
			await Contact.findByIdAndUpdate(contactId, body);
		} else {
			throw new Error(404);
		}
	} catch (err) {
		throw new Error(err.message);
	}
};

export const updateStatusContact = async (contactId, favorite) => {
	try {
		const foundContact = await getContactById(contactId);
        console.log(foundContact);
        
		if (foundContact) {
			if (foundContact.favorite !== favorite.favorite) {
				await Contact.findByIdAndUpdate(contactId, favorite);
			} else {
				throw new Error(`Contact already ${favorite.favorite}`);
			}
		} else {
			throw new Error('Contact not found');
		}
	} catch (err) {
		throw new Error(err.message);
	}
};
