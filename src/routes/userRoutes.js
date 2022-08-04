import { Router } from "express";
import { getUserInfos } from "../controllers/usersController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const userRouter = Router();

userRouter.get("/users/me", authenticateToken, getUserInfos);
