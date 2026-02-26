import PickupRequest from "../models/pickupRequestModel.js";
import { sendStatusEmail } from "../services/emailService.js";

// CREATE request
export const createRequest = async (req, res) => {
  try {
    const { userId, email, itemName, quantity, address, preferredDate, ewasteItemId } = req.body;

    if (!userId || !email || !itemName || !quantity || !address || !preferredDate) {
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

// UPDATE status
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

    console.log("Status updated to:", updated.status);
    console.log("Sending email to:", updated.email);

    // send email
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
// DELETE request
export const deleteRequest = async (req, res) => {
  try {
    await PickupRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Recycler ACCEPT request
export const acceptRequest = async (req, res) => {
  try {
    // only recycler should accept
    const recyclerId = req.user.id;

    const request = await PickupRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    // prevent double-accept
    if (request.recyclerId) {
      return res.status(400).json({ message: "This request is already accepted" });
    }

    // set accepted fields + status
    request.recyclerId = recyclerId;
    request.status = "Approved";
    request.acceptedAt = new Date();

    const updated = await request.save();

    // send email to customer with current status
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