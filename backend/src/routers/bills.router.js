import express from "express";
import { createBill, getBillsByGroup, getBillById, updateBill, deleteBill, getBalances } from "../controllers/bill.controller.js";

const router = express.Router();

router.post("/createBill", createBill); // Create a bill
router.get("/getBills/:groupId", getBillsByGroup); // Get all bills for a group
router.get("/getBill/:billId", getBillById); // Get a specific bill
router.put("/updateBill/:billId", updateBill); // Update a bill
router.delete("/deleteBill/:billId", deleteBill); // Delete a bill
router.get("/getBalances/:groupId", getBalances); // Get balances for a group

export default router;
