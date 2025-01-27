import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  authenticateUser,
} from "../controllers/authentication.controller.js";

import { checkForUserAuthentication } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);
router.route("/authenticate").get(authenticateUser);
router.route("/logout").post(checkForUserAuthentication, logoutUser);

export default router;