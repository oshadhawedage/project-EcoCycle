import User from "../models/User.model.js";
import RecyclerRequest from "../models/RecyclerRequest.model.js";

/**
 * Get All Users
 * Retrieves list of all non-deleted users (admin only)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    // Only return users that are NOT deleted
    const users = await User.find({ deletedAt: null }).select("-passwordHash");
    res.json({ 
      count: users.length, 
      users,
      message: "Active users retrieved successfully"
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update User Role
 * Changes the role of a user (USER, RECYCLER, ADMIN)
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowed = ["USER", "RECYCLER", "ADMIN"];

    if (!allowed.includes(role)) {
      return res.status(400).json({ message: "Invalid role. Use USER, RECYCLER, or ADMIN." });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.deletedAt) return res.status(400).json({ message: "Cannot modify deleted user" });

    user.role = role;
    const result = await user.save();

    const safeUser = await User.findById(result._id).select("-passwordHash");
    res.json({ message: `Role updated to ${role}`, user: safeUser });
  } catch (err) {
    next(err);
  }
};

/**
 * Block/Unblock User
 * Blocks or unblocks a user account
 * Admin can unblock users as well
 */
export const blockUser = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;

    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({ message: "isBlocked must be boolean (true/false)" });
    }

    if (req.params.id === req.user._id.toString() && isBlocked === true) {
      return res.status(400).json({ message: "Cannot block your own account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.deletedAt) return res.status(400).json({ message: "Cannot modify deleted user" });

    user.isBlocked = isBlocked;
    const result = await user.save();

    const safeUser = await User.findById(result._id).select("-passwordHash");
    const action = isBlocked ? "blocked" : "unblocked";
    res.json({ 
      message: `User ${action} successfully`, 
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete User Account
 * Soft deletes a user account (admin only)
 * Sets deletedAt timestamp and prevents login
 */
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (user.deletedAt) {
      return res.status(400).json({ message: "User already deleted" });
    }

    user.deletedAt = new Date();
    const result = await user.save();

    res.json({ 
      message: "User deleted successfully",
      deletedAt: result.deletedAt
    });
  } catch (err) {
    next(err);
  }
};


// ===== RECYCLER REQUESTS =====

export const getRecyclerRequests = async (req, res, next) => {
  try {
    const requests = await RecyclerRequest.find()
      .populate("userId", "fullName email role")
      .sort({ createdAt: -1 });

    res.json({ count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};



// Only USER can request recycler promotion, so no need to check role here. Admin will review and approve/reject.
export const reviewRecyclerRequest = async (req, res, next) => {
  try {
    const { status, adminNote = "" } = req.body;

    const request = await RecyclerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "PENDING") {
      return res.status(400).json({ message: `Request already ${request.status}` });
    }

    request.status = status;
    request.adminNote = adminNote;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    // ✅ if approved → upgrade user role + set recycler details
    if (status === "APPROVED") {
      const user = await User.findById(request.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.role = "RECYCLER";
      user.recyclerDetails.businessName = request.businessName;
      user.recyclerDetails.serviceArea = request.serviceArea;
      user.recyclerDetails.isVerifiedRecycler = true; // admin approved
      await user.save();
    }

    res.json({ message: `Request ${status.toLowerCase()}`, request });
  } catch (err) {
    next(err);
  }
};