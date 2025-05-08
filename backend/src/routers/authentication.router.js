import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updatePassword,
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
router.route("/updatePassword").post(checkForUserAuthentication,updatePassword);


export default router;