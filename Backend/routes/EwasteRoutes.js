import express from "express";
import {
  createEwasteItem,
  getEwasteItems,
  getEwasteItemById,
  updateEwasteItem,
  deleteEwasteItem,
} from "../controllers/EwasteController.js";

//import { protect } from "../middlewares/authMiddleware.js";
import { mockUser } from "../middleware/mockUser.js";

const router = express.Router();

// All routes protected
router.route("/")
  .post(mockUser, createEwasteItem)
  .get(mockUser, getEwasteItems);

router.route("/:id")
  .get(mockUser, getEwasteItemById)
  .put(mockUser, updateEwasteItem)
  .delete(mockUser, deleteEwasteItem);

export default router;