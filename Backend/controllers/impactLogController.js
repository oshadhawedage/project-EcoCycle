import ImpactLog from "../models/ImpactLog.js";
import Settings from "../models/Settings.js";

const allowedActions = ["RECYCLE", "DONATE", "SELL"];

// Helper: always have one settings document
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

// POST /api/impact-logs
export const createImpactLog = async (req, res) => {
  try {
    const { userId, userName, actionType, category } = req.body;
    let { weightKg } = req.body;

    // 1) Basic validation
    if (!userId || !userName || !actionType || !category) {
      return res.status(400).json({
        message: "userId, userName, actionType, category are required",
      });
    }

    if (!allowedActions.includes(actionType)) {
      return res.status(400).json({
        message: `actionType must be one of: ${allowedActions.join(", ")}`,
      });
    }

    // 2) Load settings
    const settings = await getOrCreateSettings();

    // 3) If weight not provided, use default weight by category
    if (weightKg === undefined || Number(weightKg) <= 0) {
      const defaultW = settings.defaultWeightByCategory?.get?.(category);
      weightKg = defaultW ?? 0.5; // fallback default
    }

    // 4) Calculate CO2
    const factor = settings.co2FactorPerKg ?? 3;
    const co2SavedKg = Number(weightKg) * factor;

    // 5) Create log (NO duplicate blocking now — as you requested earlier)
    const created = await ImpactLog.create({
      userId,
      userName,
      actionType,
      category,
      weightKg: Number(weightKg),
      co2SavedKg,
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/impact-logs?userId=&actionType=&category=
export const getImpactLogs = async (req, res) => {
  try {
    const { userId, actionType, category } = req.query;

    // ✅ This is the correct filter logic
    const filter = {};
    if (userId) filter.userId = userId;
    if (actionType) filter.actionType = actionType;
    if (category) filter.category = category;

    const logs = await ImpactLog.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(logs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/impact-logs/:id
export const updateImpactLog = async (req, res) => {
  try {
    const { weightKg } = req.body;

    if (weightKg === undefined || Number(weightKg) <= 0) {
      return res.status(400).json({ message: "weightKg must be > 0" });
    }

    const settings = await getOrCreateSettings();
    const factor = settings.co2FactorPerKg ?? 3;

    const updated = await ImpactLog.findByIdAndUpdate(
      req.params.id,
      {
        weightKg: Number(weightKg),
        co2SavedKg: Number(weightKg) * factor,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Impact log not found" });

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/impact-logs/:id
export const deleteImpactLog = async (req, res) => {
  try {
    const deleted = await ImpactLog.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Impact log not found" });

    return res.status(200).json({ message: "Impact log deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};