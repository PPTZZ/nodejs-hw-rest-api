import Joi from 'joi';

export const joiSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string(),
	phone: Joi.string(),
	favorite: Joi.bool(),
});

export const favoriteJoiSchema = Joi.object({
	favorite: Joi.bool(),
});
