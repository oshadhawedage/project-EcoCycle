// models/pickupRequestModel.js
import mongoose from "mongoose";

// Pickup Request Schema
const pickupRequestSchema = new mongoose.Schema(
  {
    // Customer/User id (string for now; later can be ObjectId ref User)
    userId: {
      type: String,
      required: true,
      trim: true,
    },

    // Customer email (used for status notification emails)
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Related E-waste item id (from EwasteItem component)
    // This connects your component with the E-waste item management component
    ewasteItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EwasteItem",
      default: null,
    },

    // Simple item details (can be shown to recycler)
    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    // Quantity of items
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Pickup address
    address: {
      type: String,
      required: true,
      trim: true,
    },

    // Preferred pickup date selected by customer
    preferredDate: {
      type: Date,
      required: true,
    },

    // Status flow
    // Pending -> Approved (accepted) -> Collected -> Completed
    status: {
      type: String,
      enum: ["Pending", "Approved", "Collected", "Completed"],
      default: "Pending",
    },

    // Recycler who accepted this request
    recyclerId: {
      type: String, // later can be ObjectId ref User
      default: null,
      trim: true,
    },

    // Date/time when recycler accepted the request
    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

export default mongoose.model("PickupRequest", pickupRequestSchema);