import User from "../models/user.model.js";
import Watchlist from "../models/watchlist.model.js";
import bcrypt from "bcryptjs";


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};


export const addUser = async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Remove password from response
    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({
      message: "✅ User created successfully",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Error creating user",
      error: error.message,
    });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    await user.save();

    res.json({ message: "User updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
  }
};


export const getStats = async (req, res) => {
  try {
    // Total registered users
    const totalUsers = await User.countDocuments();

    // Total watchlist entries (across all users)
    const totalWatchlistEntries = await Watchlist.aggregate([
      { $unwind: "$stocks" },
      { $count: "total" },
    ]);

    const totalWatchlistedStocks = totalWatchlistEntries[0]?.total || 0;

    // Count how many users have watchlisted each stock
    const stockCounts = await Watchlist.aggregate([
      { $unwind: "$stocks" },
      {
        $group: {
          _id: "$stocks.symbol",
          count: { $sum: 1 },
          companies: { $addToSet: "$stocks.company" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Top 3 most watchlisted stocks
    const topStocks = stockCounts.slice(0, 3);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalWatchlistedStocks,
        topStocks,
        stockCounts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
      error: error.message,
    });
  }
};