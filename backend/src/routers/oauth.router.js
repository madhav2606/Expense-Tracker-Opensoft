import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { logActivity } from "../controllers/activity.controller.js";

const router = express.Router();

router.get(
  "/api/oauth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get(
  "/api/oauth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async(req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      await logActivity(req.user._id, "Login")

      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success` +
        `?token=${token}` +
        `&name=${encodeURIComponent(req.user.name)}` +
        `&email=${encodeURIComponent(req.user.email)}` +
        `&_id=${req.user._id}`;


      res.redirect(redirectUrl);
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect("/login");
    }
  }
);


export default router;