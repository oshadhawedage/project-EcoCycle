import express from "express";
import {
  getOverview,
  getMonthlyTrend,
  getCategoryDistribution,
  getLeaderboard,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/overview", getOverview);
router.get("/monthly-trend", getMonthlyTrend);
router.get("/category-distribution", getCategoryDistribution);
router.get("/leaderboard", getLeaderboard);

export default router;