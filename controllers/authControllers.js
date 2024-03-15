import jwt from "jsonwebtoken";

import * as authServices from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";

import { createContactSchema, updateContactSchema, updateStatusSchema } from "../schemas/contactsSchemas.js";
import { handleServerError } from "../models/hooks.js";

const { JWT_SECRET } = process.env;

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


export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authServices.findUser({ email });
        if (!user) {
            throw HttpError(401, "Email or password is wrong")
        }

        const comparePassword = await authServices.validatePassword(password, user.password);
        if (!comparePassword) {
            throw HttpError(401, "Email or password is wrong")
        }

        const { _id: id } = user;

        const payload = {
            id,
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
        await authServices.updateUser({ _id: id }, { token });

        res.json({
            token,
            "user": {
                "email": user.email,
                "subscription": user.subscription
            }
        })

    } catch (error) {
        next(error);
    }
}

export const getCurrent = async (req, res, next) => {
    try {
        const { email, subscription } = req.user;

        res.json({
            email,
            subscription
        })
    } catch (error) {
        next(error);
    };

}

export const logout = async (req, res, next) => {
    try {
        const { _id } = req.user;
        await authServices.updateUser({ _id }, { token: "" });

        res.status(204).json({
            message: "204 No Content"
        })

    } catch (error) {
        next(error);
    }
}