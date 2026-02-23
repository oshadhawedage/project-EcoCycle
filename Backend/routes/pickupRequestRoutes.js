import express from "express";
const router = express.Router();

import { createRequest } from "../controllers/pickupRequestController.js";

// CRUD Routes
router.post("/", createRequest);


export default router;
