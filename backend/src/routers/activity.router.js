import { Router } from "express";
import { getActivity } from "../controllers/activity.controller.js";
import { checkForUserAuthentication } from "../middleware/auth.middleware.js";


const router=Router();

router.route("/getActivity").get(checkForUserAuthentication,getActivity)

export default router