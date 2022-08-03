import { Router } from "express";
import { createUser } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.get("/signup", createUser);
