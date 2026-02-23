import mongoose from "mongoose";

const impactLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    actionType: { type: String, enum: ["RECYCLE", "DONATE", "SELL"], required: true },
    category: { type: String, required: true },
    weightKg: { type: Number, required: true },
    co2SavedKg: { type: Number, required: true },
  },
  { timestamps: true }
);

const ImpactLog = mongoose.model("ImpactLog", impactLogSchema);
export default ImpactLog;