import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

const secret = process.env.JWT_SECRET;

export const createUserController = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;
		const result = await createUser({
			email,
			name,
			password,
		});

		const payload = { email: result.email };
		const token = jwt.sign(payload, secret, {
			expiresIn: '1h',
		});

		res.status(201).json({
			status: 'Success',
			code: 201,
			data: {
				email: result.email,
				token,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 404,
			error: err.message,
		});
	}
};

export const loginUserController = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const result = await findUser({ email, password });

		const payload = { email: result.email };
		const token = jwt.sign(payload, secret, {
			expiresIn: '1h',
		});

		res.status(200).json({
			status: 'Success',
			code: 200,
			data: {
				token,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: 404,
			error: err.message,
		});
	}
};

export const updateUserController = async (req, res, next) => {
	const { userId } = req.params;
	const { major } = req.body;
	try {
		const result = await updateUser(userId, { major });
		if (result) {
			res.status(200).json({
				stat: 'Updated',
				code: 200,
				data: result,
			});
		}
	} catch (err) {
		res.status(404).json({
			status: 404,
			error: err.message,
		});
	}
};

export const getCurrentUsernameController = async (req, res, next) => {
	try {
		const user = jwt.verify(token, secret);
		const result = findUserName({ email: user.email });
		if (result) {
			res.status(200).json({
				status: 'Success',
				code: 200,
				data: {
					name: result.name,
				},
			});
		}
	} catch (err) {
		res.status(404).json({
			status: 404,
			error: err.message,
		});
	}
};
