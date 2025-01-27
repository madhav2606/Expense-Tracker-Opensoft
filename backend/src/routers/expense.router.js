import { Router } from "express";
import { checkForUserAuthentication } from "../middleware/auth.middleware.js";
import {
    AddExpense,
    DeleteExpense,
    UpdatExpense,
    ViewExpense,
    ViewIndividualExpense
} from '../controllers/expense.controller.js';

const router = Router();
router.route("/expenses/add").post(checkForUserAuthentication, AddExpense);
router.route("/expenses/viewindividual/:id").get(ViewIndividualExpense);
router.route("/expenses/view").get(ViewExpense);
router.route("/expenses/delete/:id").delete(DeleteExpense);
router.route("/expenses/update/:id").put(UpdatExpense);

export default router;