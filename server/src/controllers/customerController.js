const Customer = require("../models/Customer");

/**
 * Get all customers for the company
 */
exports.getCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const companyId = req.user.companyId;

    let query = { companyId };

    // Text search if search term provided
    if (search) {
      query.$text = { $search: search };
    }

    const customers = await Customer.find(query)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Customer.countDocuments(query);

    res.json({
      customers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get customer by ID
 */
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const customer = await Customer.findOne({ _id: id, companyId });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Get customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create new customer
 */
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, nationalId, notes } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    const customer = new Customer({
      companyId,
      name,
      email,
      phone,
      address,
      nationalId,
      notes,
      createdBy: userId,
      modifiedBy: userId,
    });

    await customer.save();

    res.status(201).json(customer);
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update customer
 */
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, nationalId, notes } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.id;

    const customer = await Customer.findOneAndUpdate(
      { _id: id, companyId },
      {
        name,
        email,
        phone,
        address,
        nationalId,
        notes,
        modifiedBy: userId,
      },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Update customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete customer
 */
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    // Check if customer is used in any cases
    const Case = require("../models/Case");
    const casesCount = await Case.countDocuments({
      companyId,
      $or: [{ plaintiffId: id }, { defendantId: id }],
    });

    if (casesCount > 0) {
      return res.status(400).json({
        message: `Cannot delete customer. They are referenced in ${casesCount} case(s).`,
      });
    }

    const customer = await Customer.findOneAndDelete({ _id: id, companyId });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Search customers for autocomplete
 */
exports.searchCustomers = async (req, res) => {
  try {
    const { q } = req.query;
    const companyId = req.user.companyId;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const customers = await Customer.find({
      companyId,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    })
      .limit(10)
      .select("name email phone")
      .lean();

    res.json(customers);
  } catch (error) {
    console.error("Search customers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
