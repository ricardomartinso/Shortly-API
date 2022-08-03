import { Router } from "express";
import { createUser, login } from "../controllers/authController.js";
import { validateCreateUser } from "../middlewares/validateCreateUser.js";
import { validateLoginUser } from "../middlewares/validateLoginUser.js";
export const authRouter = Router();

authRouter.post("/signup", validateCreateUser, createUser);
authRouter.post("/signin", validateLoginUser, login);
