import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verify,
} from "../controllers/authentication.controller.js";

import { checkForUserAuthentication } from "../middleware/auth.middleware.js";

const router = Router();
router.route('/signup').post(registerUser);
router.route('/signin').post(loginUser);
router.route("/logout").post(checkForUserAuthentication, logoutUser);
router.route("/verify").get(verify)



export default router;