import jwt from "jsonwebtoken";
import * as gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from 'nanoid'

import * as authServices from "../services/authServices.js";
import * as emailService from "../services/emailServices.js";

import HttpError from "../helpers/HttpError.js";

import { resendVerificationEmailSchema } from "../schemas/usersSchemas.js";

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
        const verificationToken = nanoid();
        const body = { ...req.body, subscription, avatarURL, verificationToken }
        const newUser = await authServices.signup(body);

        await emailService.sendVerifyEmail(email, verificationToken);

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

        if (!user.verify) {
            throw HttpError(400, "Email isn't verified")
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

export const verify = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await authServices.findUser({ verificationToken });
        if (!user) {
            throw HttpError(404, "User not found")
        }

        await authServices.updateUser({ _id: user._id }, { verificationToken: "-", verify: true });

        res.status(200).json({ message: "Verification successful" });
    } catch (error) {
        next(error);
    }
}

export const resendVerificationEmail = async (req, res, next) => {
    try {
        const { error } = resendVerificationEmailSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }

        const { email } = req.body;
        const user = await authServices.findUser({ email });
        if (!user) {
            throw HttpError(404, "User not found");
        }

        if (user.verify) {
            throw HttpError(404, "Verification has already been passed");
        }

        await emailService.sendVerifyEmail(email, user.verificationToken);

        res.status(200).json({
            message: "Verification email sent"
        });
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