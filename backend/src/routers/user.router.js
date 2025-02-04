import { Router } from "express";
import {changeRole, changeStatus, dashStats, deleteUser, getAllUsers, getUser, updateUser, userStats} from '../controllers/user.controller.js'
import { checkForUserAuthentication } from "../middleware/auth.middleware.js";
const router=Router();

router.route('/getUsers').get(checkForUserAuthentication,getAllUsers)
router.route('/changeStatus').put(checkForUserAuthentication,changeStatus)
router.route('/changeRole').put(checkForUserAuthentication,changeRole)
router.route('/deleteUser/:id').delete(checkForUserAuthentication,deleteUser)
router.route('/updateUser/:id').put(checkForUserAuthentication,updateUser)
router.route('/dashboardStats').get(checkForUserAuthentication,dashStats)
router.route('/activityChart').get(checkForUserAuthentication,userStats)
router.route("/users/:id").get(checkForUserAuthentication,getUser)

export default router