import PickupRequest from "../models/pickupRequestModel.js";
import { sendStatusEmail } from "../services/emailService.js";

// CREATE request (Customer)
export const createRequest = async (req, res) => {
  try {
    const { userId, email, itemName, quantity, address, preferredDate, ewasteItemId } = req.body;

    // basic validation
    if (!userId || !email || !itemName || !quantity || !address || !preferredDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const request = await PickupRequest.create({
      userId,
      email,
      itemName,
      quantity,
      address,
      preferredDate,
      ewasteItemId: ewasteItemId || null,
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
    const recyclerId = req.user._id; // from JWT protect middleware

    const request = await PickupRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    // prevent multiple recyclers accepting same request
    if (request.recyclerId) {
      return res.status(400).json({ message: "Request already accepted" });
    }

    request.recyclerId = recyclerId;
    request.status = "Approved";
    request.acceptedAt = new Date();

    const updated = await request.save();

    // Send email to customer when accepted
    await sendStatusEmail({
      to: updated.email,
      itemName: updated.itemName,
      status: updated.status,
    });

    return res.json(updated);
  } catch (error) {
    console.log("acceptRequest error:", error.message);
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