import { Router } from "express";
import {changeRole, changeStatus, dashStats, deleteUser, getAllUsers, getUser, updateUser, userStats} from '../controllers/user.controller.js'
import { checkForUserAuthentication } from "../middleware/auth.middleware.js";
import { checkAdmin } from "../middleware/protected.middleware.js";
const router=Router();

router.route('/getUsers').get(checkForUserAuthentication,checkAdmin,getAllUsers)
router.route('/changeStatus').put(checkForUserAuthentication,checkAdmin,changeStatus)
router.route('/changeRole').put(checkForUserAuthentication,checkAdmin,changeRole)
router.route('/deleteUser/:id').delete(checkForUserAuthentication,checkAdmin,deleteUser)
router.route('/updateUser/:id').put(checkForUserAuthentication,checkAdmin,updateUser)
router.route('/dashboardStats').get(checkForUserAuthentication,checkAdmin,dashStats)
router.route('/activityChart').get(checkForUserAuthentication,checkAdmin,userStats)
router.route("/users/:id").get(checkForUserAuthentication,getUser)

export default router