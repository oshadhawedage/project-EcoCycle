import express from "express";
const router = express.Router();

import { createRequest,
         getAllRequests,
         getRequestById
        } from "../controllers/pickupRequestController.js";

// CRUD Routes
router.post("/", createRequest);
router.get("/", getAllRequests);
router.get("/:id", getRequestById);


export default router;
