import express from "express";
const router = express.Router();

import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateStatus,
  deleteRequest,
  acceptRequest
} from "../controllers/pickupRequestController.js";

import { authMock, allowRoles } from "../middleware/authMock.js";

// All routes protected (mock)
router.use(authMock);

// Customer creates request after clicking "Recycle"
router.post("/", allowRoles("customer"), createRequest);

// Recycler/Admin can view all requests
router.get("/", allowRoles("recycler", "admin"), getAllRequests);

// Recycler/Admin can view request details
router.get("/:id", allowRoles("recycler", "admin"), getRequestById);

// Recycler accepts request (this is your key workflow)
router.put("/:id/accept", allowRoles("recycler"), acceptRequest);

// Admin (optional) updates status later (Collected/Completed)
router.put("/:id/status", allowRoles("admin", "recycler"), updateStatus);

// Admin can delete (optional)
router.delete("/:id", allowRoles("admin"), deleteRequest);

export default router;