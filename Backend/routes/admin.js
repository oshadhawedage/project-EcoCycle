import express from "express";

/**
 * Admin Routes
 * Protected routes for admin user management
 * All routes require authentication and ADMIN role
 * Routes:
 *   - GET /users - Get all users
 *   - PATCH /users/:id/role - Update user role
 *   - PATCH /users/:id/block - Block/unblock user
 *   - DELETE /users/:id - Delete user (soft delete)
 */

// Controllers
import {
  getAllUsers,
  updateUserRole,
  blockUser,
  deleteUser,
  getRecyclerRequests,
  reviewRecyclerRequest
} from "../controllers/admin.controller.js";

// Middleware
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

// Validations
import { updateRoleValidation, blockUserValidation,reviewRecyclerRequestValidation } from "../middleware/validators.js";



const router = express.Router();

// Middleware: Authentication & Authorization
router.use(protect);
router.use(authorizeRoles("ADMIN"));

// ===== ADMIN USER MANAGEMENT ROUTES =====
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateRoleValidation, updateUserRole);
router.patch("/users/:id/block", blockUserValidation, blockUser);
router.delete("/users/:id", deleteUser);
router.get("/recycler-requests", getRecyclerRequests);
router.patch("/recycler-requests/:id", reviewRecyclerRequestValidation, reviewRecyclerRequest);

export default router;