import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
} from "../controllers/auth.controller.js"; // ✅ correct path

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-Password", forgotPassword);

export default router;
