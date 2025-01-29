import { Router } from "express";
import { checkForUserAuthentication } from "../middleware/auth.middleware.js";
import {
    AddExpense,
    DeleteExpense,
    UpdatExpense,
} from '../controllers/expense.controller.js';

const router = Router();
router.route("/expenses/add").post(checkForUserAuthentication, AddExpense);
router.route("/expenses/delete/:id").delete(checkForUserAuthentication,DeleteExpense);
router.route("/expenses/update/:id").put(checkForUserAuthentication,UpdatExpense);

export default router;