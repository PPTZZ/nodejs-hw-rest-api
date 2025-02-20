import Joi from "joi";

export const joiSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.bool(),
  owner: Joi.string(),
});

export const favoriteJoiSchema = Joi.object({
  favorite: Joi.bool(),
});

export const joiSignupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().optional(),
  subscription: Joi.string().optional(),
  avatarUrl: Joi.string(),
});

export const joiLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
