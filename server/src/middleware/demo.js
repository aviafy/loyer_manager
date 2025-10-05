const config = require("../config");

/**
 * Middleware to inject demo mode flag into request
 */
function demoMiddleware(req, res, next) {
  req.isDemo = config.isDemoMode;
  next();
}

module.exports = demoMiddleware;

