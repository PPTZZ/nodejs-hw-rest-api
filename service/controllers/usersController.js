import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {
	createUser,
	findCurrentUser,
	loginUser,
	logOutUser,
	validateBody,
} from '../index.js';
import { joiLoginSchema, joiSignupSchema } from '../schemas/joi.js';

const SECRET = process.env.JWT_SECRET;

export const createUserController = async (req, res) => {
	try {
		await validateBody(req.body, joiSignupSchema);
		const payload = { email: req.body.email };
		const token = jwt.sign(payload, SECRET, {
			expiresIn: '1h',
		});
		const result = await createUser({ ...req.body, token: token });
		res.status(201).json({
			message: 'Success',
			status: 201,
			data: {
				email: result.email,
				token,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: err.status,
			error: err.message,
		});
	}
};

export const loginUserController = async (req, res) => {
	try {
		await validateBody(req.body, joiLoginSchema);
		const payload = { email: req.body.email };
		const token = jwt.sign(payload, SECRET, {
			expiresIn: '1h',
		});
		const result = await loginUser(req.body, token);
		res.status(200).json({
			message: 'Success',
			status: 200,
			data: {
				data: result,
				token,
			},
		});
	} catch (err) {
		res.status(err.status).json({
			status: err.status,
			error: err.message,
		});
	}
};

export const updateUserController = async (req, res) => {
	const { userId } = req.params;
	const { major } = req.body;
	try {
		const result = await updateUser(userId, major);
		if (result) {
			res.status(200).json({
				message: 'Updated',
				status: 200,
				data: result,
			});
		}
	} catch (err) {
		res.status(err.status).json({
			status: err.status,
			error: err.message,
		});
	}
};

export const getCurrentUserController = async (req, res) => {
	try {
		const token = req.header('Authorization')?.split(' ')[1];
		const user = jwt.verify(token, SECRET);
		if (user) {
			const result = await findCurrentUser(token);
			res.status(200).json({
				status: 'Success',
				code: 200,
				data: {
					result,
				},
			});
		}
	} catch (err) {
		res.status(404).json({
			status: err.status,
			error: err.message,
		});
	}
};

export const logOutUserController = async (req, res) => {
	try {
		await logOutUser(req.params.userId);
		res.status(204).json({message:"No content"});
	} catch (err) {
		res.status(401).json(err.message);
	}
};