import express from "express";
import { login, refresh, logout, me } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
