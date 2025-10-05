const express = require("express");
const Case = require("../models/Case");
const FIELD_MAP = require("../utils/fieldMap");
const {
  normalize,
  buildSearchQuery,
  validatePagination,
} = require("../utils/helpers");
const { generateCasesExcel } = require("../services/excelService");

const router = express.Router();

/**
 * GET /api/cases/export
 * Export cases to Excel file
 * NOTE: This must come BEFORE /:id route to avoid conflict
 */
router.get("/export", async (req, res, next) => {
  try {
    const { search = "", field = "" } = req.query;

    // Build search query
    const query = buildSearchQuery(search, field, FIELD_MAP);

    // Fetch all matching cases
    const cases = await Case.find(query).sort({ _id: 1 }).lean();

    // Generate Excel workbook
    const workbook = await generateCasesExcel(cases);

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="cases_${Date.now()}.xlsx"`
    );

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cases
 * List all cases with search, filter, sort, and pagination
 */
router.get("/", async (req, res, next) => {
  try {
    const {
      search = "",
      field = "",
      sort = "createdAt",
      order = "asc",
      page = "1",
      limit = "50",
    } = req.query;

    // Build search query
    const query = buildSearchQuery(search, field, FIELD_MAP);

    // Validate pagination
    const { pageNum, limitNum } = validatePagination(page, limit);

    // Fetch cases
    const docs = await Case.find(query)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({
      data: docs,
      page: pageNum,
      limit: limitNum,
      count: docs.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/cases
 * Create a new case
 */
router.post("/", async (req, res, next) => {
  try {
    if (req.isDemo) {
      return res.status(403).json({ error: "Demo mode: write disabled" });
    }

    // Normalize string fields
    const body = Object.fromEntries(
      Object.entries(req.body || {}).map(([k, v]) => [
        k,
        typeof v === "string" ? normalize(v) : v,
      ])
    );

    const created = await Case.create(body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/cases/:id
 * Get a single case by ID
 */
router.get("/:id", async (req, res, next) => {
  try {
    const doc = await Case.findById(req.params.id).lean();

    if (!doc) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(doc);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/cases/:id
 * Update a case by ID
 */
router.put("/:id", async (req, res, next) => {
  try {
    if (req.isDemo) {
      return res.status(403).json({ error: "Demo mode: write disabled" });
    }

    // Normalize string fields
    const body = Object.fromEntries(
      Object.entries(req.body || {}).map(([k, v]) => [
        k,
        typeof v === "string" ? normalize(v) : v,
      ])
    );

    const updated = await Case.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/cases/:id
 * Delete a case by ID
 */
router.delete("/:id", async (req, res, next) => {
  try {
    if (req.isDemo) {
      return res.status(403).json({ error: "Demo mode: write disabled" });
    }

    const deleted = await Case.findByIdAndDelete(req.params.id).lean();

    if (!deleted) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json({ ok: true, message: "Case deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
