const User = require("../models/User");
const { normalize } = require("../utils/helpers");

/**
 * List all users in the company
 */
async function listUsers(req, res, next) {
  try {
    const users = await User.find({ companyId: req.companyId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ data: users });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new user
 */
async function createUser(req, res, next) {
  try {
    if (req.isDemo) {
      return res.status(403).json({ error: "Demo mode: write disabled" });
    }

    const { email, password, firstName, lastName, role } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Validate role
    const validRoles = ["CompanyAdmin", "Staff", "ReadOnly"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Check if user already exists in this company
    const existingUser = await User.findOne({
      companyId: req.companyId,
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists in your company" });
    }

    // Create user
    const user = await User.create({
      companyId: req.companyId,
      email: email.toLowerCase(),
      password,
      firstName: normalize(firstName),
      lastName: normalize(lastName),
      role: role || "Staff",
      status: "active",
    });

    res.status(201).json(user.toJSON());
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific user
 */
async function getUserById(req, res, next) {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      companyId: req.companyId,
    }).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * Update a user
 */
async function updateUser(req, res, next) {
  try {
    if (req.isDemo) {
      return res.status(403).json({ error: "Demo mode: write disabled" });
    }

    const { firstName, lastName, role, status } = req.body;

    // Find user
    const user = await User.findOne({
      _id: req.params.id,
      companyId: req.companyId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent admin from demoting themselves if they're the only admin
    if (
      user._id.toString() === req.user._id.toString() &&
      role !== "CompanyAdmin"
    ) {
      const adminCount = await User.countDocuments({
        companyId: req.companyId,
        role: "CompanyAdmin",
        status: "active",
      });

      if (adminCount === 1) {
        return res
          .status(400)
          .json({ error: "Cannot demote the only active admin" });
      }
    }

    // Update fields
    if (firstName) user.firstName = normalize(firstName);
    if (lastName) user.lastName = normalize(lastName);
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a user
 */
async function deleteUser(req, res, next) {
  try {
    if (req.isDemo) {
      return res.status(403).json({ error: "Demo mode: write disabled" });
    }

    // Find user
    const user = await User.findOne({
      _id: req.params.id,
      companyId: req.companyId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent admin from deleting themselves if they're the only admin
    if (user._id.toString() === req.user._id.toString()) {
      const adminCount = await User.countDocuments({
        companyId: req.companyId,
        role: "CompanyAdmin",
        status: "active",
      });

      if (adminCount === 1) {
        return res
          .status(400)
          .json({ error: "Cannot delete the only active admin" });
      }
    }

    await user.deleteOne();

    res.json({ ok: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
