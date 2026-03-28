import express from "express";
const router = express.Router();

import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateStatus,
  deleteRequest,
  acceptRequest,
  getAcceptedRequests,
} from "../controllers/pickupRequestController.js";

import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

// Customer creates pickup request (after clicking "Recycle")
router.post("/", protect, authorizeRoles("USER"), createRequest);

// Recycler/Admin view all pickup requests
router.get("/", protect, authorizeRoles("RECYCLER", "ADMIN"), getAllRequests);

// Recycler/Admin view request details
router.get("/:id", protect, authorizeRoles("RECYCLER", "ADMIN"), getRequestById);

// Recycler accepts a pickup request (updates status + sends email)
router.put("/:id/accept", protect, authorizeRoles("RECYCLER"), acceptRequest);

// Admin/Recycler updates status (Collected / Completed etc.)
router.put("/:id/status", protect, authorizeRoles("ADMIN", "RECYCLER"), updateStatus);

// Recycler accepted pickup requests (Dashboard -> Accepted Requests)
router.get("/accepted/my", protect, authorizeRoles("RECYCLER"), getAcceptedRequests);

// Admin deletes pickup request
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteRequest);

export default router;