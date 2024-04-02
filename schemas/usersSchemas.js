import Joi from "joi";

export const userSignupSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    subscription: Joi.string().valid('starter', 'pro', 'business'),
    token: Joi.string(),
})

export const userSigninSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
})

export const resendVerificationEmailSchema = Joi.object({
    email: Joi.string().email().required()
})