const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} = require("../controllers/customerController");
const { authenticate } = require("../middleware/auth");
const {
  createCustomerValidator,
  updateCustomerValidator,
} = require("../validators");
const { validationResult } = require("express-validator");

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// All routes require authentication
router.use(authenticate);

// Search for autocomplete
router.get("/search", searchCustomers);

// CRUD operations
router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomerValidator, validate, createCustomer);
router.put("/:id", updateCustomerValidator, validate, updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
