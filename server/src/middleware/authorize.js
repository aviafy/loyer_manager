/**
 * Authorization middleware factory
 * Creates middleware that checks if user has one of the allowed roles
 * Must be used AFTER authenticate middleware
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: allowedRoles,
        current: req.user.role,
      });
    }

    next();
  };
}

/**
 * Check if user is admin
 */
function requireAdmin(req, res, next) {
  return authorize("CompanyAdmin")(req, res, next);
}

/**
 * Check if user is admin or staff
 */
function requireStaffOrAdmin(req, res, next) {
  return authorize("CompanyAdmin", "Staff")(req, res, next);
}

module.exports = { authorize, requireAdmin, requireStaffOrAdmin };
