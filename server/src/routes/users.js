const express = require("express");
const { authenticate } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/authorize");
const { userController } = require("../controllers");

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

/**
 * GET /api/users
 * List all users in the company
 */
router.get("/", userController.listUsers);

/**
 * POST /api/users
 * Create a new user (admin only)
 */
router.post("/", requireAdmin, userController.createUser);

/**
 * GET /api/users/:id
 * Get a specific user
 */
router.get("/:id", userController.getUserById);

/**
 * PUT /api/users/:id
 * Update a user (admin only)
 */
router.put("/:id", requireAdmin, userController.updateUser);

/**
 * DELETE /api/users/:id
 * Delete a user (admin only)
 */
router.delete("/:id", requireAdmin, userController.deleteUser);

module.exports = router;
