const User = require("../models/user");

exports.getAllUsers = async (req, res, next) => {
  // Checking authorization
  if (req.user.type !== "admin") {
    return res.status(401).json({ message: "Not authorized!" });
  }
  try {
    // Fetching uders
    const users = await User.find({ type: "user" })
      .select("-password")
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    // Fetching order
    const user = await User.findById(req.user._id)
      .select("name contact email address")
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

exports.getAdminUsers = async (req, res) => {
  // Checking authorization
  if (req.user.type !== "admin") {
    return res.status(401).json({ message: "Not authorized!" });
  }
  try {
    // Fetching uders
    const users = await User.find({ $or: [{ type: "admin" }, { type: 'staff' }] })
      .select("name email contact type")
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
}
