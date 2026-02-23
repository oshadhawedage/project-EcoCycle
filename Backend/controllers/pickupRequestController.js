import PickupRequest from "../models/pickupRequestModel.js";

// CREATE request
export const createRequest = async (req, res) => {
  try {
    const { userId, itemName, quantity, address, preferredDate } = req.body;

    if (!userId || !itemName || !quantity || !address || !preferredDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const request = await PickupRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};