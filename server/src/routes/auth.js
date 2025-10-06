const express = require("express");
const { authenticate } = require("../middleware/auth");
const { authController } = require("../controllers");

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new company with first admin user
 */
router.post("/register", authController.register);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post("/login", authController.login);

/**
 * POST /api/auth/logout
 * Logout and clear auth cookie
 */
router.post("/logout", authController.logout);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get("/me", authenticate, authController.getCurrentUser);

module.exports = router;
