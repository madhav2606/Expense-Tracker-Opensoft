import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verify,
} from "../controllers/authentication.controller.js";

import { checkForUserAuthentication } from "../middleware/auth.middleware.js";

const router = Router();
router.route('/signup').post(registerUser);
router.route('/signin').post(loginUser);
router.route("/logout").post(checkForUserAuthentication, logoutUser);
router.route("/verify").get(verify)
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);



export default router;