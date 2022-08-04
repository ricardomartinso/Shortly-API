import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { rankingRouter } from "./rankingRoutes.js";
import { urlRouter } from "./urlRoutes.js";
import { userRouter } from "./userRoutes.js";

export const router = Router();

router.use(authRouter);
router.use(urlRouter);
router.use(userRouter);
router.use(rankingRouter);
