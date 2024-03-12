import express from "express";

import * as authController from "../controllers/authControllers.js";

import { userSigninSchema, userSignupSchema } from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", authController.signup);
authRouter.post("/login", authController.signin);

export default authRouter;