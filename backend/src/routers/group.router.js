import { Router } from "express";
import { createGroup, deleteGroup, getGroupById, getGroups, getOverallSmartSettlements, joinGroup } from "../controllers/group.controller.js";

const router= Router();

router.post("/createGroup/:userId", createGroup);
router.delete("/deleteGroup/:groupId", deleteGroup);
router.get("/getGroups/:userId", getGroups);
router.post("/joinGroup", joinGroup);
router.get("/getGroup/:groupId", getGroupById);
export default router;