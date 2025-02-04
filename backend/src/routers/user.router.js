import { Router } from "express";
import {changeRole, changeStatus, dashStats, deleteUser, getAllUsers, getUser, updateUser, userStats} from '../controllers/user.controller.js'
import { checkForUserAuthentication } from "../middleware/auth.middleware.js";
const router=Router();

router.route('/getUsers').get(getAllUsers)
router.route('/changeStatus').put(changeStatus)
router.route('/changeRole').put(changeRole)
router.route('/deleteUser/:id').delete(deleteUser)
router.route('/updateUser/:id').put(updateUser)
router.route('/dashboardStats').get(dashStats)
router.route('/activityChart').get(userStats)
router.route("/users/:id").get(checkForUserAuthentication,getUser)

export default router