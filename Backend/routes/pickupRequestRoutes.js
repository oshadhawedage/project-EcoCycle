import express from "express";
const router = express.Router();

import { createRequest,
         getAllRequests,
         getRequestById,
         updateStatus,
         deleteRequest
        } from "../controllers/pickupRequestController.js";

// CRUD Routes
router.post("/", createRequest);
router.get("/", getAllRequests);
router.get("/:id", getRequestById);
router.put("/:id/status", updateStatus);
router.delete("/:id", deleteRequest);

export default router;
