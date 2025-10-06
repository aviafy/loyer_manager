const express = require("express");
const ShareableLink = require("../models/ShareableLink");
const Case = require("../models/Case");
const { authenticate, optionalAuthenticate } = require("../middleware/auth");
const { requireStaffOrAdmin } = require("../middleware/authorize");

const router = express.Router();

/**
 * POST /api/shareable-links
 * Create a new shareable link for a case
 */
router.post("/", authenticate, requireStaffOrAdmin, async (req, res, next) => {
  try {
    if (req.isDemo) {
      return res.status(403).json({ error: "Demo mode: write disabled" });
    }

    const { caseId, expiresInDays, recipientEmail, password } = req.body;

    if (!caseId) {
      return res.status(400).json({ error: "caseId is required" });
    }

    // Verify case exists and belongs to user's company
    const caseDoc = await Case.findOne({
      _id: caseId,
      companyId: req.companyId,
    });

    if (!caseDoc) {
      return res.status(404).json({ error: "Case not found" });
    }

    // Calculate expiration date
    let expiresAt;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create shareable link
    const link = await ShareableLink.create({
      companyId: req.companyId,
      caseId,
      expiresAt,
      recipientEmail: recipientEmail ? recipientEmail.toLowerCase() : undefined,
      password, // Store plain password for now (consider hashing if needed)
      createdBy: req.user._id,
    });

    res.status(201).json({
      ...link.toJSON(),
      url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/shared/${
        link.token
      }`,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/shareable-links/case/:caseId
 * Get all shareable links for a specific case
 */
router.get("/case/:caseId", authenticate, async (req, res, next) => {
  try {
    // Verify case belongs to user's company
    const caseDoc = await Case.findOne({
      _id: req.params.caseId,
      companyId: req.companyId,
    });

    if (!caseDoc) {
      return res.status(404).json({ error: "Case not found" });
    }

    const links = await ShareableLink.find({
      caseId: req.params.caseId,
      companyId: req.companyId,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Add full URLs
    const linksWithUrls = links.map((link) => ({
      ...link,
      url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/shared/${
        link.token
      }`,
    }));

    res.json({ data: linksWithUrls });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/shareable-links/:token/verify
 * Verify a shareable link and get case info (public route)
 */
router.get("/:token/verify", optionalAuthenticate, async (req, res, next) => {
  try {
    const { password } = req.query;

    const link = await ShareableLink.findOne({ token: req.params.token });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Check if link is valid
    if (!link.isValid()) {
      await link.save(); // Save status update if expired
      return res.status(403).json({ error: "Link is no longer valid" });
    }

    // Check password if required
    if (link.password && link.password !== password) {
      return res.status(401).json({
        error: "Password required",
        requiresPassword: true,
      });
    }

    // Get case details
    const caseDoc = await Case.findById(link.caseId).lean();

    if (!caseDoc) {
      return res.status(404).json({ error: "Case not found" });
    }

    // Record access
    await link.recordAccess();

    res.json({
      case: caseDoc,
      link: {
        _id: link._id,
        expiresAt: link.expiresAt,
        recipientEmail: link.recipientEmail,
        accessCount: link.accessCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/shareable-links/:id/revoke
 * Revoke a shareable link
 */
router.put(
  "/:id/revoke",
  authenticate,
  requireStaffOrAdmin,
  async (req, res, next) => {
    try {
      if (req.isDemo) {
        return res.status(403).json({ error: "Demo mode: write disabled" });
      }

      const link = await ShareableLink.findOne({
        _id: req.params.id,
        companyId: req.companyId,
      });

      if (!link) {
        return res.status(404).json({ error: "Link not found" });
      }

      link.status = "revoked";
      await link.save();

      res.json(link);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/shareable-links/:id
 * Delete a shareable link
 */
router.delete(
  "/:id",
  authenticate,
  requireStaffOrAdmin,
  async (req, res, next) => {
    try {
      if (req.isDemo) {
        return res.status(403).json({ error: "Demo mode: write disabled" });
      }

      const link = await ShareableLink.findOneAndDelete({
        _id: req.params.id,
        companyId: req.companyId,
      });

      if (!link) {
        return res.status(404).json({ error: "Link not found" });
      }

      res.json({ ok: true, message: "Link deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
