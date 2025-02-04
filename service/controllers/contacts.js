import { listContacts } from '..';

export const getContactsController = async (req, res, next) => {
	const results = await listContacts();
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
