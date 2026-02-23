import express from "express";
import {
  createImpactLog,
  getImpactLogs,
  updateImpactLog,
  deleteImpactLog,
} from "../controllers/impactLogController.js";

const router = express.Router();

router.post("/", createImpactLog);
router.get("/", getImpactLogs);
router.put("/:id", updateImpactLog);
router.delete("/:id", deleteImpactLog);

export default router;