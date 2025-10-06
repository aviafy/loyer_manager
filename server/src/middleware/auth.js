const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");

/**
 * Authentication middleware
 * Verifies JWT token from HttpOnly cookie and attaches user + company to req
 */
async function authenticate(req, res, next) {
  try {
    // Get token from cookie
    const token = req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Get user with company info
    const user = await User.findById(decoded.userId).lean();

    if (!user || user.status !== "active") {
      return res.status(401).json({ error: "Invalid or inactive user" });
    }

    // Get company
    const company = await Company.findById(user.companyId).lean();

    if (!company || company.status !== "active") {
      return res.status(403).json({ error: "Company is not active" });
    }

    // Attach to request
    req.user = user;
    req.company = company;
    req.companyId = user.companyId;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    next(error);
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token exists, but doesn't require it
 */
async function optionalAuthenticate(req, res, next) {
  try {
    const token = req.cookies?.authToken;

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );
      const user = await User.findById(decoded.userId).lean();

      if (user && user.status === "active") {
        const company = await Company.findById(user.companyId).lean();
        if (company && company.status === "active") {
          req.user = user;
          req.company = company;
          req.companyId = user.companyId;
        }
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
}

module.exports = { authenticate, optionalAuthenticate };
