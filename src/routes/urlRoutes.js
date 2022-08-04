import { Router } from "express";
import {
  createShortUrl,
  deleteShortUrl,
  getUrlById,
  openShortUrl,
} from "../controllers/urlsController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { validateShortUrl } from "../middlewares/validateShortUrl.js";
export const urlRouter = Router();

urlRouter.post(
  "/urls/shorten",
  authenticateToken,
  validateShortUrl,
  createShortUrl
);
urlRouter.get("/urls/:id", getUrlById);
urlRouter.get("/urls/open/:shortUrl", openShortUrl);
urlRouter.delete("/urls/:id", authenticateToken, deleteShortUrl);
