import Settings from "../models/Settings.js";

// Helper: ensure we always have one settings document
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

// GET /api/settings
export const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    return res.status(200).json(settings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const { co2FactorPerKg, monthlyTargetKg, defaultWeightByCategory } = req.body;

    if (co2FactorPerKg !== undefined) settings.co2FactorPerKg = Number(co2FactorPerKg);
    if (monthlyTargetKg !== undefined) settings.monthlyTargetKg = Number(monthlyTargetKg);
    if (defaultWeightByCategory !== undefined) settings.defaultWeightByCategory = defaultWeightByCategory;

    await settings.save();
    return res.status(200).json(settings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};