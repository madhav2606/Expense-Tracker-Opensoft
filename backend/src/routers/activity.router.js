import { Router } from "express";
import { getActivity } from "../controllers/activity.controller.js";
import { checkForUserAuthentication } from "../middleware/auth.middleware.js";
import { checkAdmin } from "../middleware/protected.middleware.js";

const router=Router();

router.route("/getActivity").get(checkForUserAuthentication,checkAdmin,getActivity)

export default router