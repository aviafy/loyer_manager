const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const User = require("../models/User");
const { normalize } = require("../utils/helpers");
const { validateRegisterData, validateLoginData } = require("../validators");

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Register a new company with first admin user
 */
async function register(req, res, next) {
  try {
    if (req.isDemo) {
      return res
        .status(403)
        .json({ error: "Demo mode: registration disabled" });
    }

    const {
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    // Validate required fields
    if (
      !companyName ||
      !companyEmail ||
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Check if company email already exists
    const existingCompany = await Company.findOne({
      email: companyEmail.toLowerCase(),
    });
    if (existingCompany) {
      return res
        .status(409)
        .json({ error: "Company email already registered" });
    }

    // Create company
    const company = await Company.create({
      name: normalize(companyName),
      email: companyEmail.toLowerCase(),
      phone: companyPhone ? normalize(companyPhone) : undefined,
      address: companyAddress ? normalize(companyAddress) : undefined,
    });

    // Create admin user
    const user = await User.create({
      companyId: company._id,
      email: email.toLowerCase(),
      password,
      firstName: normalize(firstName),
      lastName: normalize(lastName),
      role: "CompanyAdmin",
      status: "active",
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, companyId: company._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: user.toJSON(),
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
      },
      message: "Company registered successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login with email and password
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLoginData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check user status
    if (user.status !== "active") {
      return res.status(403).json({ error: "Account is inactive" });
    }

    // Check company status
    const company = await Company.findById(user.companyId);

    if (!company || company.status !== "active") {
      return res.status(403).json({ error: "Company is not active" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, companyId: user.companyId, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: user.toJSON(),
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout and clear auth cookie
 */
function logout(req, res) {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logout successful" });
}

/**
 * Get current authenticated user
 */
async function getCurrentUser(req, res, next) {
  try {
    res.json({
      user: req.user,
      company: {
        _id: req.company._id,
        name: req.company.name,
        email: req.company.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
