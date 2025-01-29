import { Router } from "express";
import {changeRole, changeStatus, deleteUser, getAllUsers, updateUser} from '../controllers/user.controller.js'
const router=Router();

router.route('/getUsers').get(getAllUsers)
router.route('/changeStatus').put(changeStatus)
router.route('/changeRole').put(changeRole)
router.route('/deleteUser/:id').delete(deleteUser)
router.route('/updateUser/:id').put(updateUser)

export default router