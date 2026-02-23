//Import mongoose library to define MongoDB schema
import mongoose from "mongoose";

// Define the schema for pickup requests
const pickupRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    email: { 
      type: String, 
      required: true, 
      trim: true },

    itemName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    preferredDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Collected", "Completed"],
      default: "Pending",
    },
  },

  // Enable automatic createdAt and updatedAt timestamps
  { timestamps: true }
);

//  Export the model to use in controllers
export default mongoose.model("PickupRequest", pickupRequestSchema);
