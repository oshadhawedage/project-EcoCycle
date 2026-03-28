import PickupRequest from "../models/pickupRequestModel.js";
import { sendStatusEmail } from "../services/emailService.js";
import EwasteItem from "../models/EwasteItem.js";

// CREATE request (Customer)
export const createRequest = async (req, res) => {
  try {
    const { ewasteItemId, quantity, address, preferredDate } = req.body;

    const userId = req.user._id;
    const email = req.user.email;

    if (!ewasteItemId || !quantity || !address || !preferredDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Get ewaste item from DB
    const item = await EwasteItem.findById(ewasteItemId);
    if (!item) return res.status(404).json({ message: "E-waste item not found" });

    // create pickup request using item details automatically
    const request = await PickupRequest.create({
      userId,
      email,
      ewasteItemId,
      itemName: `${item.brand} ${item.deviceType}`, // auto item name
      quantity,
      address,
      preferredDate,
      status: "Pending",
    });

    return res.status(201).json(request);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET all requests (Recycler/Admin)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await PickupRequest.find().sort({ createdAt: -1 });
    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET single request (Recycler/Admin)
export const getRequestById = async (req, res) => {
  try {
    const request = await PickupRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });
    return res.json(request);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Recycler ACCEPT request (Recycler)
export const acceptRequest = async (req, res) => {
  try {
    const recyclerId = req.user._id;

    const request = await PickupRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    if (request.recyclerId) {
      return res.status(400).json({ message: "Request already accepted" });
    }

    request.recyclerId = recyclerId;
    request.status = "Accepted"; // ✅ FIXED
    request.acceptedAt = new Date();

    const updated = await request.save();

    await sendStatusEmail({
      to: updated.email,
      itemName: updated.itemName,
      status: updated.status,
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// UPDATE status (Admin/Recycler)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updated = await PickupRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });

    // Send email on status update too
    await sendStatusEmail({
      to: updated.email,
      itemName: updated.itemName,
      status: updated.status,
    });

    return res.json(updated);
  } catch (error) {
    console.log("updateStatus error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// GET accepted requests (Recycler)
export const getAcceptedRequests = async (req, res) => {
  try {
    const recyclerId = req.user._id;

    const requests = await PickupRequest.find({
      recyclerId,
      status: "Accepted",
    }).sort({ acceptedAt: -1 });

    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE request (Admin)
export const deleteRequest = async (req, res) => {
  try {
    const deleted = await PickupRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};