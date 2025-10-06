const Case = require("../models/Case");
const FIELD_MAP = require("../utils/fieldMap");
const {
  normalize,
  buildSearchQuery,
  validatePagination,
} = require("../utils/helpers");
const { generateCasesExcel } = require("../services/excelService");
const { validateCaseData, validateCaseQuery } = require("../validators");

/**
 * Export cases to Excel
 */
async function exportCases(req, res, next) {
  try {
    const { search = "", field = "" } = req.query;

    const query = buildSearchQuery(search, field, FIELD_MAP);
    query.companyId = req.companyId;

    const cases = await Case.find(query)
      .populate("plaintiffId", "name email phone")
      .populate("defendantId", "name email phone")
      .populate("clientId", "name email phone")
      .sort({ _id: 1 })
      .lean();
    const workbook = await generateCasesExcel(cases);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="cases_${Date.now()}.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
}

/**
 * List all cases with search, filter, sort, and pagination
 */
async function listCases(req, res, next) {
  try {
    const {
      search = "",
      field = "",
      sort = "createdAt",
      order = "asc",
      page = "1",
      limit = "50",
    } = req.query;

    // Validate query params
    const validation = validateCaseQuery(req.query);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const query = buildSearchQuery(search, field, FIELD_MAP);
    query.companyId = req.companyId;

    const { pageNum, limitNum } = validatePagination(page, limit);

    const docs = await Case.find(query)
      .populate("plaintiffId", "name email phone")
      .populate("defendantId", "name email phone")
      .populate("clientId", "name email phone")
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
}

/**
 * Create a new case
 */
async function createCase(req, res, next) {
  try {
    if (req.isDemo) {
      return res.status(403).json({ error: "Demo mode: write disabled" });
    }

    // Validate input
    const validation = validateCaseData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Normalize string fields
    const body = Object.fromEntries(
      Object.entries(req.body || {}).map(([k, v]) => [
        k,
        typeof v === "string" ? normalize(v) : v,
      ])
    );

    body.companyId = req.companyId;
    body.createdBy = req.user._id;
    body.modifiedBy = req.user._id;

    const created = await Case.create(body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single case by ID
 */
async function getCaseById(req, res, next) {
  try {
    const doc = await Case.findOne({
      _id: req.params.id,
      companyId: req.companyId,
    })
      .populate("plaintiffId", "name email phone address nationalId")
      .populate("defendantId", "name email phone address nationalId")
      .populate("clientId", "name email phone address nationalId")
      .lean();

    if (!doc) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(doc);
  } catch (error) {
    next(error);
  }
}

/**
 * Update a case by ID
 */
async function updateCase(req, res, next) {
  try {
    if (req.isDemo) {
      return res.status(403).json({ error: "Demo mode: write disabled" });
    }

    // Validate input
    const validation = validateCaseData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Normalize string fields
    const body = Object.fromEntries(
      Object.entries(req.body || {}).map(([k, v]) => [
        k,
        typeof v === "string" ? normalize(v) : v,
      ])
    );

    delete body.companyId;
    body.modifiedBy = req.user._id;

    const updated = await Case.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      body,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a case by ID
 */
async function deleteCase(req, res, next) {
  try {
    if (req.isDemo) {
      return res.status(403).json({ error: "Demo mode: write disabled" });
    }

    const deleted = await Case.findOneAndDelete({
      _id: req.params.id,
      companyId: req.companyId,
    }).lean();

    if (!deleted) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json({ ok: true, message: "Case deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  exportCases,
  listCases,
  createCase,
  getCaseById,
  updateCase,
  deleteCase,
};
