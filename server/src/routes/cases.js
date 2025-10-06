const express = require("express");
const { authenticate } = require("../middleware/auth");
const { requireStaffOrAdmin } = require("../middleware/authorize");
const { caseController } = require("../controllers");

const router = express.Router();

// All case routes require authentication
router.use(authenticate);

/**
 * GET /api/cases/export
 * Export cases to Excel file
 * NOTE: This must come BEFORE /:id route to avoid conflict
 */
router.get("/export", caseController.exportCases);

/**
 * GET /api/cases
 * List all cases with search, filter, sort, and pagination
 */
router.get("/", caseController.listCases);

/**
 * POST /api/cases
 * Create a new case (staff or admin only)
 */
router.post("/", requireStaffOrAdmin, caseController.createCase);

/**
 * GET /api/cases/:id
 * Get a single case by ID (company-scoped)
 */
router.get("/:id", caseController.getCaseById);

/**
 * PUT /api/cases/:id
 * Update a case by ID (staff or admin only, company-scoped)
 */
router.put("/:id", requireStaffOrAdmin, caseController.updateCase);

/**
 * DELETE /api/cases/:id
 * Delete a case by ID (staff or admin only, company-scoped)
 */
router.delete("/:id", requireStaffOrAdmin, caseController.deleteCase);

module.exports = router;
