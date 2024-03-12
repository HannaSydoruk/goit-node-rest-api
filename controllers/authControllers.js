import * as authServices from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";

import { createContactSchema, updateContactSchema, updateStatusSchema } from "../schemas/contactsSchemas.js";

export const signup = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await authServices.findUser({ email });
        if (user) {
            throw HttpError(409, "Email in use")
        }
        const subscription = req.body.subscription ?? "starter";
        const body = { ...req.body, subscription }
        const newUser = await authServices.signup(body);

        res.status(201).json({
            "user": {
                "subscription": newUser.subscription,
                "email": newUser.email,
            }
        })
    } catch (error) {
        next(error);
    }
}
