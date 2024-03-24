import jwt from "jsonwebtoken";
import * as gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

import * as authServices from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";

import { createContactSchema, updateContactSchema, updateStatusSchema } from "../schemas/contactsSchemas.js";
import { handleServerError } from "../models/hooks.js";

const { JWT_SECRET } = process.env;
const avatarsPath = path.resolve("public", "avatars");

export const signup = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await authServices.findUser({ email });
        if (user) {
            throw HttpError(409, "Email in use")
        }
        const subscription = req.body.subscription ?? "starter";
        const avatarURL = gravatar.url(req.body.email);
        const body = { ...req.body, subscription, avatarURL }
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

export const patchAvatar = async (req, res, next) => {
    try {
        const { _id } = req.user;

        const image = await Jimp.read(req.file.path);
        await image.resize(250, 250).write(req.file.path);

        const { path: oldPath, filename } = req.file;
        const newPath = path.join(avatarsPath, filename);
        await fs.rename(oldPath, newPath);
        const avatarURL = path.join("avatars", filename);

        await authServices.updateUser({ _id }, { avatarURL });

        res.status(200).json({
            avatarURL: avatarURL
        });
    } catch (error) {
        next(error);
    }
}