import mongoose from "mongoose";

const EwasteItemSchema = new mongoose.Schema(
  {
    deviceType: {
      type: String,
      required: [true, "Device type is required"],
      enum: ["Mobile", "Laptop", "Tablet", "TV", "Other"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["Working", "Not Working"],
    },
    age: {
      type: Number,
      required: [true, "Age of the device is required"],
      min: 0,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required (in kg)"],
      min: 0,
    },
    disposalType: {
      type: String,
      required: [true, "Disposal type is required"],
      enum: ["Recycle", "Donate", "Sell"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "available",
      enum: ["available", "requested", "picked-up", "recycled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("EwasteItem", EwasteItemSchema);