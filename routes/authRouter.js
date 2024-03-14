import express from "express";

import * as authController from "../controllers/authControllers.js";

import { userSigninSchema, userSignupSchema } from "../schemas/usersSchemas.js";

import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", authController.signup);

authRouter.post("/login", authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;