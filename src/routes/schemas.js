import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(2).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid("user", "premium", "moderator", "admin"),
  cardNumber: Joi.string().when('role', { is: 'premium', then: Joi.string().min(12).required(), otherwise: Joi.forbidden() }),
  cardExpiry: Joi.string().when('role', { is: 'premium', then: Joi.string().required(), otherwise: Joi.forbidden() }),
  cardCvc: Joi.string().when('role', { is: 'premium', then: Joi.string().min(3).max(4).required(), otherwise: Joi.forbidden() }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("user", "premium", "moderator", "admin"),
});

export const updateProfileSchema = Joi.object({
  username: Joi.string().min(2).max(40),
  email: Joi.string().email(),
});

export const reviewCreateSchema = Joi.object({
  movieId: Joi.string().required(),
  movieTitle: Joi.string().min(1).max(200).required(),
  rating: Joi.number().min(1).max(10).required(),
  reviewText: Joi.string().allow("").max(2000),
  containsSpoilers: Joi.boolean(),
});

export const reviewUpdateSchema = Joi.object({
  rating: Joi.number().min(1).max(10),
  reviewText: Joi.string().allow("").max(2000),
  containsSpoilers: Joi.boolean(),
});

export const reviewIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const updateRoleSchema = Joi.object({
  role: Joi.string().valid("user", "premium", "moderator", "admin").required(),
});
