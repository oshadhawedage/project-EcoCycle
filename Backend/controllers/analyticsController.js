import ImpactLog from "../models/ImpactLog.js";
import Settings from "../models/Settings.js";

const hazardousCategories = ["Battery", "CRT", "PCB", "E-Waste Board", "Fluorescent Lamp"];

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

const startOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const startOfNextMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
};

const startOfYear = () => {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
};

const startOfNextYear = () => {
  const now = new Date();
  return new Date(now.getFullYear() + 1, 0, 1);
};

const formatMonthKey = (year, month) => {
  return `${year}-${String(month).padStart(2, "0")}`;
};

const buildMonthSeries = (startDate, monthsCount) => {
  const months = [];
  const cursor = new Date(startDate);

  for (let i = 0; i < monthsCount; i += 1) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;

    months.push({
      month: formatMonthKey(year, month),
      weightKg: 0,
      co2SavedKg: 0,
      actionsCount: 0,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
};

// GET /api/analytics/overview?period=all_time|this_year
export const getOverview = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const isAdmin = req.user.role === "ADMIN";
    const baseMatchStage = isAdmin ? {} : { userId: req.user._id.toString() };

    const period = req.query.period || "all_time";

    let periodDateMatch = {};

    if (period === "this_year") {
      periodDateMatch = {
        createdAt: {
          $gte: startOfYear(),
          $lt: startOfNextYear(),
        },
      };
    }

    const matchStage = {
      ...baseMatchStage,
      ...periodDateMatch,
    };

    const totalsByAction = await ImpactLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$actionType",
          weightKg: { $sum: "$weightKg" },
          co2SavedKg: { $sum: "$co2SavedKg" },
          count: { $sum: 1 },
        },
      },
    ]);

    const pick = (type, field) =>
      totalsByAction.find((x) => x._id === type)?.[field] || 0;

    const recycleWeightKg = pick("RECYCLE", "weightKg");
    const donateWeightKg = pick("DONATE", "weightKg");
    const sellWeightKg = pick("SELL", "weightKg");

    const reusedWeightKg = donateWeightKg + sellWeightKg;
    const totalWeightKg = recycleWeightKg + reusedWeightKg;

    const totalCo2SavedKg = totalsByAction.reduce(
      (sum, x) => sum + (x.co2SavedKg || 0),
      0
    );

    const reuseRatePercent = totalWeightKg ? (reusedWeightKg / totalWeightKg) * 100 : 0;
    const recycleRatePercent = totalWeightKg ? (recycleWeightKg / totalWeightKg) * 100 : 0;

    const hazCountAgg = await ImpactLog.aggregate([
      {
        $match: {
          ...matchStage,
          category: { $in: hazardousCategories },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const hazardousCount = hazCountAgg[0]?.count || 0;

    const from = startOfMonth();
    const to = startOfNextMonth();

    const currentMonthMatch = {
      ...baseMatchStage,
      createdAt: { $gte: from, $lt: to },
    };

    const monthAgg = await ImpactLog.aggregate([
      { $match: currentMonthMatch },
      { $group: { _id: null, weightKg: { $sum: "$weightKg" } } },
    ]);

    const thisMonthWeightKg = monthAgg[0]?.weightKg || 0;

    const monthlyTargetKg = settings.monthlyTargetKg || 0;
    const progressPercent = monthlyTargetKg
      ? (thisMonthWeightKg / monthlyTargetKg) * 100
      : 0;

    const recentLogs = await ImpactLog.find(matchStage)
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      period,
      totalWeightKg,
      reusedWeightKg,
      recycleWeightKg,
      reuseRatePercent,
      recycleRatePercent,
      hazardousCount,
      totalCo2SavedKg,
      monthlyTargetKg,
      thisMonthWeightKg,
      progressPercent,
      recentLogs,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/analytics/monthly-trend?months=6
export const getMonthlyTrend = async (req, res) => {
  try {
    const months = Math.max(1, Math.min(Number(req.query.months || 6), 24));

    const isAdmin = req.user.role === "ADMIN";
    const matchStage = isAdmin ? {} : { userId: req.user._id.toString() };

    const end = startOfNextMonth();
    const start = new Date(end);
    start.setMonth(start.getMonth() - months);

    const data = await ImpactLog.aggregate([
      { $match: { ...matchStage, createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          weightKg: { $sum: "$weightKg" },
          co2SavedKg: { $sum: "$co2SavedKg" },
          actionsCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
    ]);

    const completeSeries = buildMonthSeries(start, months);

    const mergedSeries = completeSeries.map((monthItem) => {
      const found = data.find(
        (x) => monthItem.month === formatMonthKey(x._id.y, x._id.m)
      );

      if (!found) return monthItem;

      return {
        month: monthItem.month,
        weightKg: found.weightKg || 0,
        co2SavedKg: found.co2SavedKg || 0,
        actionsCount: found.actionsCount || 0,
      };
    });

    return res.status(200).json(mergedSeries);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/analytics/category-distribution
export const getCategoryDistribution = async (req, res) => {
  try {
    const isAdmin = req.user.role === "ADMIN";
    const matchStage = isAdmin ? {} : { userId: req.user._id.toString() };

    const data = await ImpactLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          weightKg: { $sum: "$weightKg" },
        },
      },
      { $sort: { weightKg: -1 } },
    ]);

    return res.status(200).json(
      data.map((x) => ({
        category: x._id,
        count: x.count,
        weightKg: x.weightKg,
      }))
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/analytics/leaderboard?limit=10
export const getLeaderboard = async (req, res) => {
  try {
    const isAdmin = req.user.role === "ADMIN";
    if (!isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const limit = Math.max(1, Math.min(Number(req.query.limit || 10), 50));

    const data = await ImpactLog.aggregate([
      {
        $group: {
          _id: { userId: "$userId", userName: "$userName" },
          weightKg: { $sum: "$weightKg" },
          co2SavedKg: { $sum: "$co2SavedKg" },
          actionsCount: { $sum: 1 },
        },
      },
      { $sort: { co2SavedKg: -1 } },
      { $limit: limit },
    ]);

    return res.status(200).json(
      data.map((x) => ({
        userId: x._id.userId,
        userName: x._id.userName,
        weightKg: x.weightKg,
        co2SavedKg: x.co2SavedKg,
        actionsCount: x.actionsCount,
      }))
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};