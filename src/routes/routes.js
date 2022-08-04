import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { urlRouter } from "./urlRoutes.js";

export const router = Router();

router.use(authRouter);
router.use(urlRouter);
