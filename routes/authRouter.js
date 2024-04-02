import express from "express";

import * as authController from "../controllers/authControllers.js";

import { userSigninSchema, userSignupSchema } from "../schemas/usersSchemas.js";

import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", authController.signup);

authRouter.post("/login", authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.patchAvatar);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", authController.resendVerificationEmail);

export default authRouter;