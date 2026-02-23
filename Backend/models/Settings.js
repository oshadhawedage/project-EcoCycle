import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    co2FactorPerKg: { type: Number, default: 3 },
    monthlyTargetKg: { type: Number, default: 50 },
    defaultWeightByCategory: {
      type: Map,
      of: Number,
      default: {
        Laptop: 2,
        Phone: 0.3,
        Battery: 0.2,
        Cable: 0.1,
      },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;