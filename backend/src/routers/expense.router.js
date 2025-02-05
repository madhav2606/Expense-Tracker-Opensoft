import { Router } from "express";
import { checkForUserAuthentication } from "../middleware/auth.middleware.js";
import {
    AddExpense,
    DeleteExpense,
    GetExpenses,
    UpdateExpense,
} from '../controllers/expense.controller.js';

const router = Router();
router.route("/expenses/add/:id").post(checkForUserAuthentication, AddExpense);
router.route("/expenses/delete/:id/:userId").delete(checkForUserAuthentication,DeleteExpense);
router.route("/expenses/update/:id/:userId").put(checkForUserAuthentication,UpdateExpense);
router.route("/expenses/get/:userId").get(checkForUserAuthentication,GetExpenses);


export default router;