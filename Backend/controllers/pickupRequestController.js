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

// GET all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await PickupRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single request
export const getRequestById = async (req, res) => {
  try {
    const request = await PickupRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};