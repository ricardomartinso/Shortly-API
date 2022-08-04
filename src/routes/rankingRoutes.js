import { Router } from "express";
import { getRank } from "../controllers/rankingController.js";

export const rankingRouter = Router();

rankingRouter.get("/ranking", getRank);
